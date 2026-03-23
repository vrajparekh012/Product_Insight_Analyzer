from sklearn.feature_extraction.text import TfidfVectorizer

def extract_keywords(texts, top_n=10):

    vectorizer = TfidfVectorizer()

    X = vectorizer.fit_transform(texts)

    feature_names = vectorizer.get_feature_names_out()

    scores = X.sum(axis=0).A1

    keyword_scores = list(zip(feature_names, scores))

    keyword_scores.sort(key=lambda x: x[1], reverse=True)

    return keyword_scores[:top_n]