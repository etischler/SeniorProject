with open('report.xls', 'rb') as f: 
	r = requests.post('http://httpbin.org/post', files={'report.xls': f})