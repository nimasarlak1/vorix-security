"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "مدیر یک شرکت فناوری",
    text: "تیم Vorix Security پروژه ما را با کیفیت بالا و پشتیبانی عالی انجام داد."
  },
  {
    name: "کسب‌وکار آنلاین",
    text: "سرعت، امنیت و طراحی سایت کاملاً مطابق انتظار ما بود."
  },
  {
    name: "مشتری خدمات امنیتی",
    text: "راهکارهای امنیت شبکه و دوربین مداربسته بسیار حرفه‌ای اجرا شد."
  }
];


export default function Testimonials(){

  return(

    <section className="testimonials">

      <h2>
        نظرات مشتریان
      </h2>


      <div className="testimonial-grid">

        {testimonials.map((item,index)=>(

          <motion.div
            key={index}
            className="testimonial-card"
            initial={{
              opacity:0,
              y:30
            }}
            whileInView={{
              opacity:1,
              y:0
            }}
            transition={{
              duration:0.5,
              delay:index*0.15
            }}
          >

            <p>
              "{item.text}"
            </p>

            <h3>
              {item.name}
            </h3>

          </motion.div>

        ))}

      </div>


    </section>

  );

}
