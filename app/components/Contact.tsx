"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="contact" id="contact">

      <motion.div
        className="contact-info"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className="section-label">ارتباط با ما</span>

        <h2>
          پروژه بعدی خود را
          <br />
          با <strong>Vorix Security</strong> شروع کنید
        </h2>

        <p>
          برای دریافت مشاوره تخصصی، برآورد هزینه یا بررسی
          نیازهای پروژه با ما در ارتباط باشید.
        </p>

        <div className="contact-links">

          <a href="tel:09357781529">
            📞 09357781529
          </a>

          <a
            href="https://wa.me/9893577781529"
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 ارتباط در واتساپ
          </a>

          <a
            href="https://instagram.com/vorix.security"
            target="_blank"
            rel="noopener noreferrer"
          >
            ◎ @vorix.security
          </a>

        </div>
      </motion.div>


      <motion.form
        className="contact-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >

        <div className="form-row">

          <label>
            نام و نام خانوادگی

            <input
              type="text"
              name="name"
              placeholder="نام شما"
              required
              minLength={2}
              maxLength={80}
            />
          </label>


          <label>
            شماره تماس

            <input
              type="tel"
              name="phone"
              placeholder="مثلاً 09357781529"
              pattern="^(\+98|0)?9\d{9}$"
              required
            />
          </label>

        </div>


        <label>
          ایمیل

          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            maxLength={120}
          />
        </label>


        <label>
          نوع خدمات

          <select name="service" defaultValue="" required>

            <option value="" disabled>
              انتخاب کنید
            </option>

            <option value="website">
              طراحی و برنامه‌نویسی سایت
            </option>

            <option value="software">
              توسعه نرم‌افزار
            </option>

            <option value="ai">
              هوش مصنوعی
            </option>

            <option value="cctv">
              دوربین مداربسته
            </option>

            <option value="recovery">
              ریکاوری اطلاعات
            </option>

            <option value="image-enhancement">
              افزایش کیفیت تصاویر دوربین
            </option>

            <option value="network-security">
              امنیت شبکه
            </option>

            <option value="it">
              خدمات تخصصی IT
            </option>

          </select>
        </label>


        <label>
          توضیحات پروژه

          <textarea
            name="message"
            placeholder="نیاز یا توضیحات پروژه خود را بنویسید..."
            rows={6}
            required
            minLength={10}
            maxLength={2000}
          />
        </label>


        <button type="submit">
          ارسال درخواست مشاوره
        </button>


        {sent && (
          <p className="form-success">
            درخواست شما ثبت شد. به‌زودی با شما تماس می‌گیریم.
          </p>
        )}

      </motion.form>

    </section>
  );
}
