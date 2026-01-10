import nltk

def setup_nltk():
    nltk.download("punkt")
    nltk.download("punkt_tab")
    nltk.download("stopwords")
    nltk.download("wordnet")        # ✅ REQUIRED for lemmatization
    nltk.download("omw-1.4")        # ✅ REQUIRED dependency for wordnet
