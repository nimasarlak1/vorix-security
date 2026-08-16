"use client";

export default function Footer() {

  return (

    <footer className="footer">

      <div className="footer-brand">

        <h2>
          Vorix Security
        </h2>

        <p>
          راهکارهای حرفه‌ای امنیت دیجیتال،
          هوش مصنوعی و فناوری اطلاعات
        </p>

      </div>


      <div className="footer-links">

        <a href="/">
          خانه
        </a>

        <a href="#services">
          خدمات
        </a>

        <a href="#contact">
          تماس با ما
        </a>

        <a
          href="https://instagram.com/vorix.security"
          target="_blank"
          rel="noopener noreferrer"
        >
          اینستاگرام
        </a>

      </div>


      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Vorix Security.
          تمامی حقوق محفوظ است.
        </p>

      </div>


    </footer>

  );

}
