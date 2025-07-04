# תדמית בסיס רשמית עם node + libreoffice
FROM node:18-slim

# התקנת LibreOffice
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# יצירת תיקיית עבודה
WORKDIR /app

# העתקת קבצי הפרויקט
COPY . .

# התקנת תלויות
RUN npm install

# יצירת פורט
EXPOSE 10000

# הפעלת השרת
CMD ["node", "server.js"]
