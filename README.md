# 🚀 Darija AI Translator

![Python](https://img.shields.io/badge/Python-3.10-blue)
![Flask](https://img.shields.io/badge/Flask-Web_App-black)
![PyTorch](https://img.shields.io/badge/PyTorch-Deep_Learning-red)
![Transformers](https://img.shields.io/badge/HuggingFace-Transformers-yellow)
![Whisper](https://img.shields.io/badge/OpenAI-Whisper-green)
![EasyOCR](https://img.shields.io/badge/EasyOCR-OCR-orange)
![License](https://img.shields.io/badge/License-Educational-lightgrey)

## 📖 Description

**Darija AI Translator** is a full-stack AI-powered web application that translates Moroccan Darija into English using Deep Learning models.

This project includes:
- 🧹 Cleaned and preprocessed datasets
- 🤖 AI training experiments (Google Colab)
- 🌐 Flask web application
- 🎙️ Speech, text, and image translation modules

👉 **Google Colab Notebook (Training & Experiments):**  
[https://colab.research.google.com/drive/DarijaAI](https://drive.google.com/drive/folders/1iFKG9PkbRyT9mqC6KoUJ4L_Dm9AG7Ujd)

---

## ⚠️ Important Note

This project is large and includes:
- Datasets (DODa, MADAR)
- Model checkpoints
- OCR + Whisper assets
---

## 🏗️ Architecture

```text
User
  │
  ▼
Flask Frontend
  │
  ▼
Flask Backend
  │
  ├── Authentication
  ├── Translation Service
  ├── OCR Service
  └── Speech Service
  │
  ▼
AI Layer
  ├── Transformer Models
  ├── Whisper
  └── EasyOCR
  │
  ▼
MySQL Database
```

---

## 🤖 AI Models

### Transformer Models

#### Latin Darija → English

```python
Helsinki-NLP/opus-mt-mul-en
```

#### Arabic Darija → English

```python
Helsinki-NLP/opus-mt-ar-en
```

### Baseline Model

```python
Custom Seq2Seq LSTM
(PyTorch)
```

---

## 📊 Dataset

### Sources

#### MADAR Corpus

Arabic dialect parallel corpus.

#### DODa (Darija Open Dataset)

```text
86,000+ sentence pairs
Darija (Latin)
Darija (Arabic)
English
```

---

## 🛠️ Tech Stack

### Backend

```text
Python
Flask
SQLAlchemy
MySQL
```

### AI & NLP

```text
PyTorch
Transformers
Hugging Face
Whisper
EasyOCR
```

### Frontend

```text
HTML5
CSS3
Bootstrap 5
JavaScript
```
---

## 📈 Results

### Transformer

| Metric | Value |
|----------|----------|
| Training Loss | 0.0464 |
| Validation Loss | 0.0604 |
| Translation Quality | Excellent |

### LSTM

| Metric | Value |
|----------|----------|
| Training Loss | 1.68 |
| Validation Loss | 5.32 |
| Translation Quality | Limited |

---

## 🎯 Features

- ✅ Darija Text Translation
- ✅ Arabic Script Detection
- ✅ Latin Script Detection
- ✅ Speech-to-Text
- ✅ OCR Image Translation
- ✅ User Authentication
- ✅ Translation History
- ✅ Multi-modal AI Pipeline

---

## 🔮 Future Work

- Mobile Application
- Darija → French
- Darija → Spanish
- Offline Translation
- Real-Time Voice Translation
- Larger Moroccan NLP Dataset

---

## 👩‍💻 Authors
Aya Essouiri

Ouiam Taouni

### Supervisor

Prof. Mohammed Cherradi

ENSAH - Abdelmalek Essaadi University

---

## ⭐ Support

If you like this project, consider giving it a star ⭐ on GitHub.
