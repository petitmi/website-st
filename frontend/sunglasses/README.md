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
│       │           └── ... (all 22 models)
│       │
│       ├── src/
│       │   ├── App.js
│       │   ├── index.js
│       │   └── ... (other React files)
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