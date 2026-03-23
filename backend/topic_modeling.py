from collections import Counter
import re

# words that should never appear as issues
stop_words = {
    "the","a","an","this","that","is","was","are","were","am",
    "good","bad","great","nice","worst","best","product",
    "very","really","too","so","much","many","lot","one",
    "buy","bought","use","using","used","like","love",
    "phone","mobile","device","item","thing"
}

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    return text


def extract_topics(reviews, top_n=5):

    all_words = []

    for review in reviews:

        review = clean_text(str(review))
        words = review.split()

        for word in words:

            # remove short words and stopwords
            if len(word) > 3 and word not in stop_words:
                all_words.append(word)

    if len(all_words) == 0:
        return []

    word_freq = Counter(all_words)

    # most common words
    topics = [word for word, count in word_freq.most_common(top_n)]

    return topics