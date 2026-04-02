export default function Terms() {
    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 px-6 py-16 flex justify-center">
            <div className="max-w-4xl w-full">

                <h1 className="text-3xl text-white mb-4 font-semibold">
                    Terms of Service
                </h1>

                <p className="mb-8 text-sm opacity-60">
                    Last updated: 2026
                </p>

                <p className="mb-6 leading-relaxed">
                    By accessing and using TempFastMail, you agree to be bound by these
                    Terms of Service. If you do not agree, please do not use the service.
                </p>

                {/* 1 */}
                <Section title="1. Service Description">
                    TempFastMail provides disposable email addresses that allow users to
                    receive emails without registration. The service is free and intended
                    for temporary, non-sensitive use.
                </Section>

                {/* 2 */}
                <Section title="2. Acceptable Use">
                    You agree to use the service only for lawful purposes and in compliance
                    with all applicable laws and regulations.
                    <ul className="list-disc pl-6 mt-3 space-y-1">
                        <li>No illegal activities</li>
                        <li>No fraud or phishing</li>
                        <li>No abuse of third-party services</li>
                    </ul>
                </Section>

                {/* 3 */}
                <Section title="3. Prohibited Activities">
                    You may not use TempFastMail for:
                    <ul className="list-disc pl-6 mt-3 space-y-1">
                        <li>Sending or receiving spam</li>
                        <li>Harassment or abusive behavior</li>
                        <li>Bypassing security systems</li>
                        <li>Automated mass usage or bot abuse</li>
                    </ul>
                </Section>

                {/* 4 */}
                <Section title="4. Public Nature of Emails">
                    All generated email inboxes are public. Any messages received may be
                    accessed by others who know the address.
                    <br /><br />
                    <strong>
                        Do not use this service for confidential or sensitive data.
                    </strong>
                </Section>

                {/* 5 */}
                <Section title="5. No Guarantees">
                    The service is provided "as is" without warranties of any kind.
                    <br /><br />
                    We do not guarantee:
                    <ul className="list-disc pl-6 mt-3 space-y-1">
                        <li>Availability or uptime</li>
                        <li>Delivery of emails</li>
                        <li>Data persistence</li>
                    </ul>
                </Section>

                {/* 6 */}
                <Section title="6. Limitation of Liability">
                    We are not responsible for:
                    <ul className="list-disc pl-6 mt-3 space-y-1">
                        <li>Loss of data or emails</li>
                        <li>Misuse of the service by users</li>
                        <li>Damages resulting from service interruptions</li>
                    </ul>
                </Section>

                {/* 7 */}
                <Section title="7. Third-Party Services">
                    The service may rely on third-party providers (such as email delivery
                    services). We are not responsible for their performance or policies.
                </Section>

                {/* 8 */}
                <Section title="8. Termination">
                    We reserve the right to block or restrict access to the service at any
                    time without notice if abuse is detected.
                </Section>

                {/* 9 */}
                <Section title="9. Intellectual Property">
                    All content, branding, and functionality of TempFastMail are protected
                    and may not be copied or reused without permission.
                </Section>

                {/* 10 */}
                <Section title="10. Changes to Terms">
                    We may update these Terms at any time. Continued use of the service
                    means you accept the updated version.
                </Section>

                {/* 11 */}
                <Section title="11. Contact">
                    For any questions regarding these Terms, contact:
                    <br />
                    <span className="text-white">contact@tempfastmail.site</span>
                </Section>

                <div className="mt-12 pt-6 border-t border-white/10 text-sm opacity-60">
                    These Terms are provided to comply with platform policies including
                    Google AdSense requirements.
                </div>

            </div>
        </div>
    );
}

/* 🔥 Компонент секции */
function Section({ title, children }: any) {
    return (
        <div className="mb-8">
            <h2 className="text-xl text-white mb-3">{title}</h2>
            <div className="leading-relaxed">{children}</div>
        </div>
    );
}