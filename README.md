
# Age and Gender Detection

This project uses a **React frontend** and a **Flask backend** to detect the age and gender of individuals in uploaded images. It leverages pre-trained machine learning models for prediction and provides a user-friendly interface.

## Features
- **Upload Images**: Upload your own image for age and gender detection.
- **Sample Images**: Try detection using built-in sample images.
- **Dark Mode**: Toggle between light and dark modes with a ripple animation effect.
- **Download Results**: Download the processed image with predictions.

## Tech Stack
- **Frontend**: React with Tailwind CSS
- **Backend**: Flask
- **Models**: OpenCV and DNN for age and gender prediction

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd age-gender-detection
   ```

2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Install frontend dependencies:
   ```bash
   cd age-gender-ui
   npm install
   ```

4. Start the Flask backend:
   ```bash
   python app.py
   ```

5. Start the React frontend:
   ```bash
   cd age-gender-ui
   npm start
   ```

## Usage
1. Open the React app in your browser (usually `http://localhost:3000`).
2. Upload an image or choose a sample image.
3. View predictions and download the result.

## Folder Structure
```
age-gender-detection/
├── age-gender-ui/          # React frontend
│   ├── src/                # React components and app logic
│   ├── public/             # Static assets (sample images, favicon)
│   ├── package.json        # Frontend dependencies
│   └── ...                 # Other React files
├── app.py                  # Flask backend entry point
├── modelNweight/           # Pre-trained model files
├── requirements.txt        # Backend dependencies
├── README.md               # This file
└── ...                     # Other backend files
```

## Credits
The dataset used for training and testing the age and gender models was obtained [here](https://colab.research.google.com/github/MikeKwak/Gender-Age-Prediction-Model/blob/main/AgeGenderPredictionModel.ipynb#scrollTo=5wb2AHF4-zDa). We acknowledge and thank the authors for making this dataset publicly available.

## License
This project is licensed under the [MIT License](LICENSE).
