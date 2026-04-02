export default function Privacy() {
    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 px-6 py-16 max-w-4xl mx-auto">

            <h1 className="text-3xl text-white mb-6 font-semibold">
                Privacy Policy
            </h1>

            <p className="mb-4">
                TempFastMail предоставляет временные email адреса.
                Мы не храним личные данные пользователей.
            </p>

            <h2 className="text-xl text-white mt-6 mb-2">Данные</h2>
            <p className="mb-4">
                Все письма хранятся временно и автоматически удаляются.
            </p>

            <h2 className="text-xl text-white mt-6 mb-2">Cookies</h2>
            <p className="mb-4">
                Мы можем использовать cookies для улучшения работы сайта.
            </p>

            <h2 className="text-xl text-white mt-6 mb-2">Third-party</h2>
            <p>
                Мы можем использовать сторонние сервисы, такие как Google Ads.
            </p>

        </div>
    );
}