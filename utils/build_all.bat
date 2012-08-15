python build.py --include common --include extras --output ../build/three.js
python build.py --include common --include extras --minify --output ../build/three.min.js
python build.py --include canvas --minify --output ../build/three-canvas.min.js
python build.py --include webgl --minify --output ../build/three-webgl.min.js
python build.py --include extras --externs externs_extras.js --minify --output ../build/three-extras.min.js
