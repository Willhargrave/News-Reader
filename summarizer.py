import os
import json
from urllib.parse import urlparse
from flask import Flask, render_template_string, request
import feedparser
from bs4 import BeautifulSoup

app = Flask(__name__)

def load_feeds():
    feeds_path = os.path.join(os.path.dirname(__file__), "feeds.json")
    with open(feeds_path, "r") as f:
        return json.load(f)

def clean_html(html_text):
    return BeautifulSoup(html_text, "html.parser").get_text()

def fetch_news(selected_feed_urls):
    articles = []
    all_feeds = load_feeds()
    feed_map = {feed["link"]: feed["title"] for feed in all_feeds}
    for url in selected_feed_urls:
        feed_title = feed_map.get(url, url)
        feed_data = feedparser.parse(url)
        for entry in feed_data.entries[:10]:
            headline = entry.title
            link = entry.link
            print("link:", link)
            if hasattr(entry, "content"):
                content = entry.content[0].value
            elif hasattr(entry, "summary"):
                content = entry.summary
            else:
                content = "No content available."
            clean_content = clean_html(content)
            articles.append(
                f"<h3>{feed_title}: {headline}</h3>"
                f"<p>{clean_content}</p>"
                f"<p class='article-link'><a href='{link}'>Read more</a></p><hr>"
            )
    return articles

@app.route("/", methods=["GET"])
def index():
    feeds = load_feeds()
    checkboxes_html = ""
    for feed in feeds:
        title = feed["title"]
        link = feed["link"]
        checkboxes_html += f"<label><input type='checkbox' name='feeds' value='{link}'> {title}</label><br>\n"
    html = f"""
    <!DOCTYPE html>
    <html>
      <head>
        <title>News Summarizer</title>
        <style>
          body {{ font-family: Arial, sans-serif; margin: 2em; }}
          .news {{ margin-top: 20px; }}
          button {{ padding: 10px 20px; font-size: 16px; }}
          details {{ margin-bottom: 20px; cursor: pointer; }}
          summary {{ font-weight: bold; }}
        </style>
      </head>
      <body>
        <h1>News Summarizer</h1>
        <form action="/generate" method="post">
          <details>
            <summary>Select News Feeds</summary>
            {checkboxes_html}
          </details>
          <button type="submit">Show Top News Stories</button>
        </form>
      </body>
    </html>
    """
    return render_template_string(html)

@app.route("/generate", methods=["POST"])
def generate():
    selected_feed_urls = request.form.getlist("feeds")
    if not selected_feed_urls:
        selected_feed_urls = [feed["link"] for feed in load_feeds()]

    articles = fetch_news(selected_feed_urls)
    news_html = "".join(articles)

    all_feeds = load_feeds()
    checkboxes_html = ""
    for feed in all_feeds:
        title = feed["title"]
        link = feed["link"]
        checked_attr = "checked" if link in selected_feed_urls else ""
        checkboxes_html += f"<label><input type='checkbox' name='feeds' value='{link}' {checked_attr}> {title}</label><br>\n"

    html = f"""
    <!DOCTYPE html>
    <html>
      <head>
        <title>News Summarizer</title>
        <style>
          body {{ font-family: Arial, sans-serif; margin: 2em; }}
          .news {{ margin-top: 20px; }}
          button {{ padding: 10px 20px; font-size: 16px; margin-right: 10px; }}
          details {{ margin-bottom: 20px; cursor: pointer; }}
          summary {{ font-weight: bold; }}
          hr {{ border: 0; border-top: 1px solid #ccc; margin: 20px 0; }}
          /* Ensure the article links are shown by default */
          .article-link {{ display: none; }}
        </style>
      </head>
      <body>
        <h1>News Summarizer</h1>
        <form action="/generate" method="post">
          <details>
            <summary>Select News Feeds</summary>
            {checkboxes_html}
          </details>
          <button type="submit">Show Top News Stories</button>
          <button type="button" onclick="toggleLinks()">Toggle Links</button>
        </form>
        <div class="news">
          <h2>Top News Stories</h2>
          {news_html}
        </div>
        <script>
          function toggleLinks() {{
            var links = document.querySelectorAll('.article-link');
            links.forEach(function(link) {{
              if (link.style.display === 'none') {{
                link.style.display = 'block';
              }} else {{
                link.style.display = 'none';
              }}
            }});
          }}
        </script>
      </body>
    </html>
    """
    return render_template_string(html)

if __name__ == "__main__":
    app.run(debug=True)
