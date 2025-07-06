# שלב 1: בסיס עם Node ו-LibreOffice
FROM node:18-slim

# התקנת LibreOffice
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# הגדרת תיקיית עבודה
WORKDIR /app

# העתקת כל הקבצים
COPY . .

# התקנת תלויות לקוח והפקת build
WORKDIR /app/client
RUN npm install && npm run build

# התקנת תלויות שרת
WORKDIR /app/server
RUN npm install

# משתנה סביבה
ENV PORT=10000

# פתיחת הפורט
EXPOSE 10000

# חזרה לתיקיית שרת והרצת השרת
WORKDIR /app/server
CMD ["node", "server.js"]
