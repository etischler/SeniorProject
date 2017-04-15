import requests;
with open('image.png', 'rb') as f: r = requests.post('http://127.0.0.1:3000', files={'image.png': f})