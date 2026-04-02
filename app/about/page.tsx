export default function About() {
    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 px-6 py-16 flex justify-center">
            <div className="max-w-4xl w-full">

                <h1 className="text-3xl text-white mb-4 font-semibold">
                    About TempFastMail
                </h1>

                <p className="mb-8 text-sm opacity-60">
                    Last updated: 2026
                </p>

                {/* Intro */}
                <p className="mb-6 leading-relaxed">
                    TempFastMail is a modern disposable email service designed to help users
                    protect their privacy, avoid spam, and quickly receive emails without
                    registration. Our platform is built with simplicity, speed, and anonymity
                    in mind.
                </p>

                <p className="mb-10 leading-relaxed">
                    In a world where personal data is constantly requested, TempFastMail gives
                    you a way to stay in control. Whether you're signing up for a service,
                    testing an app, or avoiding unwanted newsletters — we provide a fast and
                    reliable temporary inbox solution.
                </p>

                {/* Mission */}
                <Section title="Our Mission">
                    Our mission is to make online privacy accessible to everyone.
                    <br /><br />
                    We believe users should not be forced to share personal email addresses
                    just to access basic services. TempFastMail exists to give you freedom,
                    control, and protection in the digital world.
                </Section>

                {/* Features */}
                <Section title="What We Offer">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                        <Card title="Instant Email Access">
                            Generate a temporary email address instantly without registration
                            or personal data.
                        </Card>

                        <Card title="No Sign-Up Required">
                            No accounts, no passwords, no friction — just open and use.
                        </Card>

                        <Card title="Privacy Protection">
                            Keep your real inbox safe from spam, tracking, and unwanted emails.
                        </Card>

                        <Card title="Real-Time Inbox">
                            Emails appear instantly without refreshing the page.
                        </Card>

                    </div>
                </Section>

                {/* Who it's for */}
                <Section title="Who Is This For">
                    TempFastMail is designed for:
                    <ul className="list-disc pl-6 mt-3 space-y-1">
                        <li>Developers testing email flows</li>
                        <li>Users signing up for websites or services</li>
                        <li>People avoiding spam or marketing emails</li>
                        <li>Anyone who values privacy online</li>
                    </ul>
                </Section>

                {/* Security */}
                <Section title="Privacy & Security">
                    We do not require registration and do not collect personal information
                    such as names, phone numbers, or permanent email addresses.
                    <br /><br />
                    However, temporary inboxes are public by design. Do not use this service
                    for sensitive or confidential communication.
                </Section>

                {/* Transparency */}
                <Section title="Transparency">
                    TempFastMail is a simple utility tool. We aim to be transparent about how
                    the service works:
                    <ul className="list-disc pl-6 mt-3 space-y-1">
                        <li>Emails are stored temporarily</li>
                        <li>Messages may be automatically deleted</li>
                        <li>No guarantee of long-term storage</li>
                    </ul>
                </Section>

                {/* Monetization */}
                <Section title="How We Sustain the Service">
                    To keep TempFastMail free, we may use advertising and analytics tools.
                    These help us improve the platform and maintain infrastructure costs.
                </Section>

                {/* Contact */}
                <Section title="Contact">
                    If you have questions, feedback, or business inquiries, you can reach us at:
                    <br />
                    <span className="text-white">contact@tempfastmail.site</span>
                </Section>

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-white/10 text-sm opacity-60">
                    TempFastMail is an independent project focused on privacy-first tools
                    for the modern web.
                </div>

            </div>
        </div>
    );
}

/* 🔥 Section */
function Section({ title, children }: any) {
    return (
        <div className="mb-10">
            <h2 className="text-xl text-white mb-3">{title}</h2>
            <div className="leading-relaxed">{children}</div>
        </div>
    );
}

/* 🔥 Card */
function Card({ title, children }: any) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition">
            <h3 className="text-white mb-2 font-medium">{title}</h3>
            <p className="text-sm opacity-80">{children}</p>
        </div>
    );
}