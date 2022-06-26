from email.mime import audio
from firebase_admin import firestore
from firebase_admin import credentials
import firebase_admin
import urllib.request
import magic
import ffmpeg
import os
import tempfile
import parselmouth
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from google.cloud import storage

# Use a service account
print("Current direcotry path: ", os.getcwd())
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = ".key/vocal-journal-firebase-adminsdk-oun5i-107f90e11f.json"
cred = credentials.Certificate(
    ".key/vocal-journal-firebase-adminsdk-oun5i-107f90e11f.json")
firebase_admin.initialize_app(cred)

db = firestore.client()


def handle_request(request):

    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,PUT,GET",
            "Content-Type": "application/json",
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    return_message = ""

    request_json = request.get_json()

    # parse request parameters
    result = analyze(request_json)
    print("Analysis result", result)
    return_message = {"data": result}
    print("return message:", return_message)

    return (return_message, 200, headers)


def get_file_path(filename):
    return os.path.join(tempfile.gettempdir(), filename)

# plotting functions


def draw_spectrogram(spectrogram, dynamic_range=70):
    X, Y = spectrogram.x_grid(), spectrogram.y_grid()
    sg_db = 10 * np.log10(spectrogram.values)
    plt.pcolormesh(X, Y, sg_db, vmin=sg_db.max() -
                   dynamic_range, cmap='afmhot')
    plt.ylim([spectrogram.ymin, spectrogram.ymax])
    plt.xlabel("time [s]")
    plt.ylabel("frequency [Hz]")


def draw_intensity(intensity):
    plt.plot(intensity.xs(), intensity.values.T, linewidth=3, color='w')
    plt.plot(intensity.xs(), intensity.values.T, linewidth=1)
    plt.grid(False)
    plt.ylim(0)
    plt.ylabel("intensity [dB]")


def draw_pitch(pitch):
    # Extract selected pitch contour, and
    # replace unvoiced samples by NaN to not plot
    pitch_values = pitch.selected_array['frequency']
    pitch_values[pitch_values == 0] = np.nan
    plt.plot(pitch.xs(), pitch_values, 'o', markersize=5, color='w')
    plt.plot(pitch.xs(), pitch_values, 'o', markersize=2)
    plt.grid(False)
    plt.ylim(0, pitch.ceiling)
    plt.ylabel("fundamental frequency [Hz]")


def generate_plots(audio_file_name):
    audio_path = get_file_path(audio_file_name)
    snd = parselmouth.Sound(audio_path)

    # intensity
    intensity = snd.to_intensity()
    # If desired, pre-emphasize the sound fragment before calculating the spectrogram
    pre_emphasized_snd = snd.copy()
    pre_emphasized_snd.pre_emphasize()
    spectrogram = pre_emphasized_snd.to_spectrogram(
        window_length=0.03, maximum_frequency=8000)
    plt.figure()
    draw_spectrogram(spectrogram)
    plt.twinx()
    draw_intensity(intensity)
    plt.xlim([snd.xmin, snd.xmax])
    intensity_image_path = audio_path.split(".")[0] + "_intensity.png"
    plt.savefig(intensity_image_path)
    # This must come last since plt.show() clears everything.
    # plt.show()

    # pitch
    pitch = snd.to_pitch()
    # If desired, pre-emphasize the sound fragment before calculating the spectrogram
    pre_emphasized_snd = snd.copy()
    pre_emphasized_snd.pre_emphasize()
    spectrogram = pre_emphasized_snd.to_spectrogram(
        window_length=0.03, maximum_frequency=8000)
    plt.figure()
    draw_spectrogram(spectrogram)
    plt.twinx()
    draw_pitch(pitch)
    plt.xlim([snd.xmin, snd.xmax])
    pitch_image_path = audio_path.split(".")[0] + "_pitch.png"
    plt.savefig(pitch_image_path)

    return intensity_image_path, pitch_image_path


def upload_blob(bucket_name, source_file_name, destination_blob_name):
    """Uploads a file to the bucket."""
    # The ID of your GCS bucket
    # bucket_name = "your-bucket-name"
    # The path to your file to upload
    # source_file_name = "local/path/to/file"
    # The ID of your GCS object
    # destination_blob_name = "storage-object-name"

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    print(
        f"File {source_file_name} uploaded to {destination_blob_name}."
    )

    return blob.public_url


def analyze(postObject):
    print("IN ANALYZE FUNCTION")

    # 1. Preprocessing
    createdAt = postObject["createdAt"]
    updatedAt = postObject["updatedAt"]
    audioURL = postObject["audioURL"]
    uid = postObject["uid"]
    displayName = postObject["displayName"]
    vowel = postObject["vowel"]
    pitch = postObject["pitch"]
    title = postObject["title"]
    phrase = postObject["phrase"]
    condition = postObject["condition"]
    note = postObject["note"]

    # Download sound file for conversion
    input_name = "input.wav"
    input_path = get_file_path(input_name)
    urllib.request.urlretrieve(audioURL, input_path)
    print("inputPath", input_path)
    # Name resulting file with the timestamp
    audio_file_name = str(createdAt) + ".wav"
    output_path = get_file_path(audio_file_name)
    print("output", audio_file_name)

    # Convert webm to wav
    stream = ffmpeg.input(input_path)
    stream = ffmpeg.output(stream, output_path)
    # Save sound file to a temporary directory
    stream = ffmpeg.overwrite_output(stream)
    ffmpeg.run(stream)
    print("Output: ", magic.from_file(output_path))

    # 2. Analyze
    # Read sound file
    sound = parselmouth.Sound(output_path)  # sound object from wav file
    sound_to_pitch = sound.to_pitch()
    pulses = parselmouth.praat.call(
        [sound, sound_to_pitch], "To PointProcess (cc)")

    # Get Jitter, Shimmer, HNR, MFCC

    # jitter
    jitter_local = parselmouth.praat.call(
        pulses, "Get jitter (local)", 0.0, 0.0, 0.0001, 0.02, 1.3) * 100

    # shimmer
    shimmer_local = parselmouth.praat.call(
        [sound, pulses], "Get shimmer (local)", 0, 0, 0.0001, 0.02, 1.3, 1.6)

    # HNR
    harmonicity = parselmouth.praat.call(
        sound, "To Harmonicity (cc)", 0.01, 75, 0.1, 1.0)
    hnr = parselmouth.praat.call(harmonicity, "Get mean", 0, 0)

    # 3. Plot
    intensity_plot, pitch_plot = generate_plots(audio_file_name)
    # upload to GCS and get url
    intensity_plot_url = upload_blob(
        "vocal-journal", intensity_plot, "images/"+intensity_plot.split("/")[-1])
    pitch_plot_url = upload_blob(
        "vocal-journal", pitch_plot, "images/"+pitch_plot.split("/")[-1])

    # add jitter shimmer hnr to analysis object
    analysis_object = {
        "createdAt": createdAt,
        "updatedAt": updatedAt,
        "audioURL": audioURL,
        "uid": uid,
        "displayName": displayName,
        "note": note,
        "vowel": vowel,
        "pitch": pitch,
        "title": title,
        "phrase": phrase,
        "condition": condition,
        "jitter_local": jitter_local,
        "shimmer_local": shimmer_local,
        "HNR": hnr,
        "intensityPlot": intensity_plot_url,
        "pitchPlot": pitch_plot_url
    }

    # update firestore document
    userRef = db.collection(u'users').document(uid)
    analysisRef = userRef.collection(u'analysis')

    docs = analysisRef.stream()
    for doc in docs:
        print(f'{doc.id} => {doc.to_dict()}')

    print("RESULT HERE", analysis_object)
    analysisRef.add(analysis_object)

    return analysis_object
