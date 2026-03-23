# 📊 Product Insight Analyzer

A full-stack AI-powered web application that analyzes product reviews to extract meaningful insights such as sentiment, common issues, best-performing products, and recommendations. This tool helps businesses and product teams make data-driven decisions.

---

## 🚀 Features

* 🔍 **Sentiment Analysis**
  Classifies reviews into Positive, Negative, and Neutral.

* ⚠️ **Product Issue Detection**
  Identifies common issues like Battery, Heating, Display, etc.

* 📊 **Interactive Charts**

  * Rating Distribution (Bar Chart)
  * Sentiment Distribution (Pie Chart)

* 🏆 **Best Product Detection**
  Finds the best product based on average rating.

* 🤖 **AI Recommendations**
  Suggests improvements based on detected issues.

* 📈 **Dataset Summary**

  * Total Reviews
  * Average Rating
  * Positive %
  * Top Issue

* 📥 **Download Report**
  Export analysis results for business use.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Chart.js
* Axios
* CSS

### Backend

* FastAPI
* Python
* Pandas
* NLP (custom logic for sentiment & issue detection)

---

## 📂 Project Structure

```
Product_Insight_Analyzer/
│
├── backend/
│   ├── app.py
│   ├── sentiment.py
│   ├── issue_extraction.py
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│
├── dataset/
│   ├── sample.csv
```

---

## 📥 Dataset Format

Your CSV file should contain at least:

```
product_name,review_text,rating
```

Example:

```
iPhone 13,Great camera quality,5
iPhone 13,Battery drains fast,2
Samsung S21,Excellent display,5
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/product-insight-analyzer.git
cd product-insight-analyzer
```

---

### 2️⃣ Backend Setup

```
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```


---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm start
```

---

## 🧠 How It Works

1. User uploads a CSV dataset
2. Backend processes:

   * Cleans review text
   * Performs sentiment analysis
   * Detects product issues
   * Calculates statistics
3. Results are sent to frontend
4. Dashboard displays insights visually

---

## 📸 Output Includes

* Sentiment Chart
* Rating Chart
* Detected Issues
* Best Product
* AI Suggestions
* Summary Cards

---

## 🎯 Use Cases

* Product Managers
* E-commerce Businesses
* Startups analyzing customer feedback
* Data Science projects

---

## 💡 Future Improvements

* Real-time review scraping
* Advanced NLP models (BERT, GPT)
* Product comparison dashboard
* User authentication & history
* Deployment on cloud (AWS / Vercel)

---

## 👨‍💻 Author

**Vraj Parekh**
B.Tech AI & Data Science Student

---

## ⭐ Conclusion

This project demonstrates the power of combining **AI + Data Analysis + Web Development** to build a real-world business solution for product improvement and decision-making.
