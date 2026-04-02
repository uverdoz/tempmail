export default function About() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 px-6 py-16 max-w-4xl mx-auto">

      <h1 className="text-3xl text-white mb-8 font-semibold">
        About TempMail.Site
      </h1>

      <p className="mb-6 leading-relaxed">
        TempMail.Site — это сервис временной электронной почты, разработанный
        для обеспечения конфиденциальности пользователей и защиты основной почты от спама.
      </p>

      <h2 className="text-xl text-white mt-8 mb-3">Наша миссия</h2>
      <p className="mb-6">
        Мы стремимся предоставить простой, быстрый и безопасный инструмент
        для получения email-сообщений без регистрации.
      </p>

      <h2 className="text-xl text-white mt-8 mb-3">Преимущества сервиса</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Мгновенное создание email</li>
        <li>Отсутствие регистрации</li>
        <li>Полная анонимность</li>
        <li>Защита от спама</li>
      </ul>

      <h2 className="text-xl text-white mt-8 mb-3">Для кого это</h2>
      <p className="mb-6">
        Сервис подходит для пользователей, которым необходимо быстро получить
        email без риска утечки личных данных.
      </p>

      <h2 className="text-xl text-white mt-8 mb-3">Контакты</h2>
      <p>
        По всем вопросам вы можете связаться через сайт или форму обратной связи.
      </p>

    </div>
  );
}