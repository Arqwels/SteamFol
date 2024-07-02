import style from "./Header.module.scss";

export const SectionInfoInvest = ({ money, text }) => {
  return (
    <section className={style.allInvest}>
      <p>{money} <span>₽</span></p>
      <p>{text}</p>
    </section>
  );
};
