from firebase_admin import firestore
from firebase_admin import credentials
import firebase_admin
from flask import Flask, request, jsonify
import urllib.request
import magic
import ffmpeg
import os
import tempfile
import parselmouth
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Use a service account
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '/Users/leochoo/dev/vocal-journal/.key/vocal-journal-firebase-adminsdk-oun5i-107f90e11f.json'
cred = credentials.Certificate(
    "/Users/leochoo/dev/vocal-journal/.key/vocal-journal-firebase-adminsdk-oun5i-107f90e11f.json")
firebase_admin.initialize_app(cred)

db = firestore.client()


@app.route('/', methods=["POST"])
def handle_request():
    # async def handle_request():
    # For more information about CORS and CORS preflight requests, see:
    # https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request

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

    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        # flask.Flask.make_response>`.
        `make_response <http://flask.pocoo.org/docs/1.0/api/
    """

    # Set CORS headers for the main request
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    return_message = ""

    # print("request.get data", request.get_data())
    request_json = request.get_json(force=True)
    print("request_json", request_json)

    # for debugging
    # if request_json and 'message' in request_json:
    #     print("Testing", request_json['message'])
    #     # return_message = {"data": request_json['message']}

    # parse request parameters
    result = analyze(request_json)
    # print("Analysis result", result)
    return_message = {"data": result}
    # print("return message:", return_message)

    return (return_message, 200, headers)


def get_file_path(filename):
    return os.path.join(tempfile.gettempdir(), filename)


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
    condition = postObject["condition"]
    notes = postObject["notes"]

    # Download sound file
    input_name = "input.wav"
    input_path = get_file_path(input_name)
    urllib.request.urlretrieve(audioURL, input_path)

    # Save sound file to a temporary directory
    output_name = "output.wav"
    output_path = get_file_path(output_name)

    # Convert webm to wav
    stream = ffmpeg.input(input_path)
    stream = ffmpeg.output(stream, output_path)
    stream = ffmpeg.overwrite_output(stream)
    ffmpeg.run(stream)
    # print("Output: ", magic.from_file(output_file_path))

    # 2. Analyze

    # Read sound file
    sound = parselmouth.Sound(output_path)  # sound object from wav file
    pitch = sound.to_pitch()
    pulses = parselmouth.praat.call([sound, pitch], "To PointProcess (cc)")

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

    # add jitter shimmer hnr to analysis object
    analysis_object = {
        "createdAt": createdAt,
        "updatedAt": updatedAt,
        "audioURL": audioURL,
        "uid": uid,
        "displayName": displayName,
        "notes": notes,
        "vowel": vowel,
        "pitch": pitch,
        "condition": condition,
        "jitter_local": jitter_local,
        "shimmer_local": shimmer_local,
        "HNR": hnr
    }

    # update firestore document
    userRef = db.collection(u'users').document(uid)
    analysisRef = userRef.collection(u'analysis')

    docs = analysisRef.stream()
    for doc in docs:
        print(f'{doc.id} => {doc.to_dict()}')

    analysisRef.add(analysis_object)

    return analysis_object
