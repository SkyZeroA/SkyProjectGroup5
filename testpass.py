from hashlib import sha256

data = "Password1!"

h = sha256()
h.update(data.encode('utf-8'))
hash = h.hexdigest()

print(hash)