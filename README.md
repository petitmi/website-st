/
│
├── backend/
│   ├── __init__.py
│   ├── main.py
│   │
│   ├── personal/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   ├── templates/
│       │       └── index.html
│       │       └── base.html
│       │       └── blog/
│       │       └── music/
│       │       └── gallary/
│       │       └── work/
│   │   ├── content/
│   │   └── static/
│   │
│   └── ecommerce/
│       ├── __init__.py
│       └── routes.py
│
├── frontend/
│   └── sunglasses/
│       ├── public/
│       │   ├── index.html
│       │   └── images/
│       │       └── sunglasses/
│       │           ├── 1_1_front.png
│       │           ├── 1_1_side.png
│       │           ├── 1_2_front.png
│       │           ├── 1_2_side.png
│       │           ├── 2_front.png
│       │           ├── 2_side.png
│       │           └── ... 
│       │
│       ├── src/
│       │   ├── App.js
│       │   ├── index.js
│       │   └── ProductList.js 
│       │   └── ProductDetail.js 
│       │   └── ...
│       │
│       ├── build/  (generated after npm run build)
│       │   ├── index.html
│       │   ├── static/
│       │   └── images/
│       │       └── sunglasses/
│       │           └── (copied from public/)
│       │
│       ├── package.json
│       └── package-lock.json
│
├── run.py
└── wsgi.py