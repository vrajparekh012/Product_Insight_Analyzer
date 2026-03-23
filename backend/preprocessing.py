import pandas as pd
import string
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

stop_words = set(stopwords.words("english"))

def clean_text(text):

    text = text.lower()

    text = text.translate(str.maketrans('', '', string.punctuation))

    tokens = word_tokenize(text)

    tokens = [word for word in tokens if word not in stop_words]

    return " ".join(tokens)


def preprocess_dataset(path):

    df = pd.read_csv(path)

    df["clean_review"] = df["review"].apply(clean_text)

    return df