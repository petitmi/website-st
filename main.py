from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route("/rougamo")
def blog_rgm_public():
    return render_template("/blogs/rougamo.html")

@app.route("/take-the-clouds-in-my-pocket")
def blog_ttcimp_public():
    return render_template("/blogs/take-the-clouds-in-my-pocket.html")

@app.route("/2023-recap")
def blog_2023e_public():
    return render_template("/blogs/2023-recap.html")

@app.route("/COVID-2020")
def blog_COVID2020_public():
    return render_template("/blogs/COVID-2020.html")

@app.route("/intestine-alien")
def blog_ia_public():
    return render_template("/blogs/intestine-alien.html")

@app.route("/name-preceeds-essence")
def blog_npe_public():
    return render_template("/blogs/name-preceeds-essence.html")

@app.route("/in-all-feels")
def blog_iaf_public():
    return render_template("/blogs/in-all-feels.html")
    
if __name__ == '__main__':
    app.run(debug=True)
