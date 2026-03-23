import re
from collections import Counter

# Universal issue keywords for all products
issue_keywords = {

    "Quality Issue": [
        "quality","cheap","poor","broken","damage","damaged","defective"
    ],

    "Size/Fit Issue": [
        "size","fit","tight","loose","small","big"
    ],

    "Delivery Issue": [
        "delivery","late","shipping","courier","package","packaging"
    ],

    "Performance Issue": [
        "slow","lag","freeze","hang","not working","performance"
    ],

    "Battery Issue": [
        "battery","drain","charging","charge","power"
    ],

    "Heating Issue": [
        "heat","heating","overheat","hot"
    ],

    "Sound Issue": [
        "sound","speaker","audio","volume","mic","microphone"
    ],

    "Display Issue": [
        "screen","display","touch","flicker","pixel"
    ],

    "Durability Issue": [
        "broke","break","durable","fragile","crack"
    ],

    "Price Issue": [
        "expensive","price","cost","overpriced","value"
    ]
}


def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    return text


def detect_issues(df):

    issues_found = []

    for review in df["clean_review"]:

        review = clean_text(str(review))

        for issue, keywords in issue_keywords.items():

            for keyword in keywords:

                if keyword in review:
                    issues_found.append(issue)

    issue_counts = Counter(issues_found)

    return issue_counts