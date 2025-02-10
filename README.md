# News Summarizer

A Python Script for running RSS feeds locally in a non-distracting environment. There are no calls to action, ads, or links to other stories. I want to create a site for people to consume the news on their own terms. 

1. Clone the project in your terminal
   - git clone https://github.com/Willhargrave/News-Reader.git
   - cd News-Reader
2. Create a Virtual Environment (Recommended)
   - # Mac/Linux
      python3 -m venv venv
      source venv/bin/activate

   - # Windows
       python -m venv venv
       venv\Scripts\activate

3. Install the Requirements
   - (if you don't have pip installed) python3 -m ensurepip --default-pip)
   - pip install -r requirements.txt
4. Run The Project
   non-virtual
   - python3 summarizer.py
  virtual (recommended)
   - flask run
     
   By default, the app will be available at http://127.0.0.1:5000/.
   To stop the server press CTRL + C in the terminal
