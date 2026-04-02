export default function Terms() {
    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 px-6 py-16 max-w-4xl mx-auto">

            <h1 className="text-3xl text-white mb-8 font-semibold">
                Terms of Service
            </h1>

            <p className="mb-6 leading-relaxed">
                Используя TempMail.Site, вы соглашаетесь с настоящими условиями использования.
            </p>

            <h2 className="text-xl text-white mt-8 mb-3">1. Описание сервиса</h2>
            <p className="mb-6">
                TempMail.Site предоставляет временные email-адреса для получения сообщений
                без регистрации.
            </p>

            <h2 className="text-xl text-white mt-8 mb-3">2. Использование</h2>
            <p className="mb-6">
                Пользователь обязуется использовать сервис только в законных целях.
            </p>

            <h2 className="text-xl text-white mt-8 mb-3">3. Ограничения</h2>
            <p className="mb-6">
                Запрещено использовать сервис для:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>мошенничества</li>
                    <li>спама</li>
                    <li>незаконной деятельности</li>
                </ul>
            </p>

            <h2 className="text-xl text-white mt-8 mb-3">4. Доступность</h2>
            <p className="mb-6">
                Мы не гарантируем бесперебойную работу сервиса.
            </p>

            <h2 className="text-xl text-white mt-8 mb-3">5. Ответственность</h2>
            <p className="mb-6">
                Мы не несём ответственности за содержимое полученных писем.
            </p>

            <h2 className="text-xl text-white mt-8 mb-3">6. Изменения</h2>
            <p>
                Условия могут быть изменены без предварительного уведомления.
            </p>

        </div>
    );
}