from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd
import json

from sentiment import get_sentiment
from issue_extraction import detect_issues

app = FastAPI(title="Product Analyzer API")

# Global variable to store last report
report_data = {}

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    global report_data

    # ----------------------------
    # Read Dataset
    # ----------------------------
    df = pd.read_csv(file.file)

    print("Dataset Columns:", df.columns)

    # ----------------------------
    # Detect Review Column
    # ----------------------------
    review_column = None

    for col in df.columns:
        if "review" in col.lower() or "text" in col.lower() or "content" in col.lower():
            review_column = col
            break

    if review_column is None:
        return {"error": "Dataset must contain a review column"}

    df["clean_review"] = df[review_column].astype(str)

    # ----------------------------
    # Detect Rating Column
    # ----------------------------
    rating_column = None

    for col in df.columns:
        if "rating" in col.lower() or "score" in col.lower() or "star" in col.lower():
            rating_column = col
            break

    if rating_column is None:
        return {"error": "Dataset must contain a rating column"}

    df["rating"] = df[rating_column]

    # ----------------------------
    # Sentiment Analysis
    # ----------------------------
    df["sentiment"] = df["clean_review"].apply(get_sentiment)

    sentiment_distribution = df["sentiment"].value_counts().to_dict()

    rating_distribution = df["rating"].value_counts().sort_index().to_dict()

    # ----------------------------
    # Detect Product Issues
    # ----------------------------
    issues_dict = detect_issues(df)

    print("\nDetected Product Issues:")
    for issue, count in issues_dict.items():
        print(issue, ":", count)

    issues = []

    for issue, count in issues_dict.items():
        issues.append({
            "issue": issue,
            "count": count
        })

    # ----------------------------
    # Automatic Dataset Insight Summary
    # ----------------------------
    total_reviews = len(df)

    avg_rating = round(df["rating"].mean(), 2)

    positive_percent = round((df["sentiment"] == "Positive").mean() * 100, 2)

    negative_percent = round((df["sentiment"] == "Negative").mean() * 100, 2)

    top_issue = max(issues_dict, key=issues_dict.get)

    dataset_summary = {
        "total_reviews": total_reviews,
        "average_rating": avg_rating,
        "positive_percent": positive_percent,
        "negative_percent": negative_percent,
        "top_issue": top_issue
    }

    # ----------------------------
    # Best Product Detection
    # ----------------------------
    best_product = "Single Product Dataset"

    if "product" in df.columns:

        product_scores = df.groupby("product").agg({
            "rating": "mean",
            "sentiment": lambda x: (x == "Positive").mean()
        })

        best_product = product_scores.sort_values(
            by=["rating", "sentiment"],
            ascending=False
        ).index[0]

    # ----------------------------
    # Product Recommendation Insight
    # ----------------------------
    recommendations = []

    if "battery" in issues_dict:
        recommendations.append("Improve battery optimization.")

    if "heating" in issues_dict:
        recommendations.append("Optimize device temperature control.")

    if "screen" in issues_dict:
        recommendations.append("Improve display quality testing.")

    if "camera" in issues_dict:
        recommendations.append("Enhance camera performance.")

    if len(recommendations) == 0:
        recommendations.append("Product performance is good. Maintain quality standards.")

    # ----------------------------
    # Save Report Data
    # ----------------------------
    report_data = {
        "dataset_summary": dataset_summary,
        "sentiment_distribution": sentiment_distribution,
        "rating_distribution": rating_distribution,
        "issues": issues,
        "best_product": best_product,
        "recommendations": recommendations
    }

    # ----------------------------
    # API Response
    # ----------------------------
    return report_data


# ----------------------------
# Download Report API
# ----------------------------
@app.get("/download-report")
def download_report():

    file_name = "product_analysis_report.json"

    with open(file_name, "w") as f:
        json.dump(report_data, f, indent=4)

    return FileResponse(file_name, filename=file_name)