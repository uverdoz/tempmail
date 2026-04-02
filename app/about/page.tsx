export default function About() {
    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 px-6 py-16 max-w-4xl mx-auto">

            <h1 className="text-3xl text-white mb-8 font-semibold">
                About TempMail.Site
            </h1>

            <p className="mb-6 leading-relaxed">
                TempMail.Site is a temporary email service designed to ensure user privacy and protect your primary email from spam.
            </p>

            <h2 className="text-xl text-white mt-8 mb-3">Our mission</h2>
            <p className="mb-6">
                We strive to provide a simple, fast, and secure tool for receiving emails without registration.
            </p>

            <h2 className="text-xl text-white mt-8 mb-3">Benefits of the service</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Instant email creation</li>
                <li>Lack of registration</li>
                <li>Complete anonymity</li>
                <li>Spam protection</li>
            </ul>

            <h2 className="text-xl text-white mt-8 mb-3">Who is this for?</h2>
            <p className="mb-6">
                The service is suitable for users who need to quickly receive emails without the risk of personal data leakage.
            </p>

            <h2 className="text-xl text-white mt-8 mb-3">Contacts</h2>
            <p>
                For any questions, you can contact us through the website or the feedback form.
            </p>

        </div>
    );
}