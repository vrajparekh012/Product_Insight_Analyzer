import matplotlib.pyplot as plt

def rating_distribution(df):

    ratings = df["rating"].value_counts().sort_index()

    plt.figure()

    ratings.plot(kind="bar")

    plt.title("Rating Distribution")

    plt.xlabel("Rating")

    plt.ylabel("Number of Reviews")

    plt.show()
    
def sentiment_chart(df):

    sentiment_counts = df["sentiment"].value_counts()

    plt.figure()

    sentiment_counts.plot(kind="pie", autopct="%1.1f%%")

    plt.title("Sentiment Distribution")

    plt.ylabel("")

    plt.show()
    
from wordcloud import WordCloud


def word_cloud(reviews):

    text = " ".join(reviews)

    wordcloud = WordCloud(width=800, height=400, background_color="white").generate(text)

    plt.figure()

    plt.imshow(wordcloud)

    plt.axis("off")

    plt.title("Most Frequent Words")

    plt.show()
    

def issue_frequency_chart(issue_list):

    issue_counts = {}

    for issue in issue_list:

        if issue in issue_counts:
            issue_counts[issue] += 1
        else:
            issue_counts[issue] = 1

    names = list(issue_counts.keys())

    values = list(issue_counts.values())

    plt.figure()

    plt.bar(names, values)

    plt.title("Detected Product Issues")

    plt.xlabel("Issues")

    plt.ylabel("Frequency")

    plt.xticks(rotation=30)

    plt.show()