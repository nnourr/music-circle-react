import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../home/components/navbar.component";

export const Privacy: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full lg:overflow-y-auto flex flex-col items-center">
      <NavbarComponent menuClicked={() => navigate("/home")} />
      <div className="max-w-[90ch] p-12 text-white text-sm h-full overflow-y-auto lg:overflow-y-visible">
        <h1 className="text-xl lg:text-lg-xl leading-tight">Privacy Policy</h1>
        <h2 className="text-lg lg:text-lg-lg">Introduction</h2>
        Welcome to Music-Circle (the "Site"). I, Noureldeen Ahmed, operate this
        Site as an individual and am committed to protecting your privacy. This
        privacy policy explains how I collect, use, and protect personal
        information obtained through the Site. For any questions or concerns,
        please contact me at{" "}
        <a href="mailto:nnourr.me@nnourr.me">nnourr.me@nnourr.me</a> or visit{" "}
        <a href="https://nnourr.tech" target="_black" rel="noreferrer">
          nnourr.tech
        </a>
        .<h2 className="mt-8 text-lg lg:text-lg-lg">Information Collection</h2>I
        collect information provided by the Spotify API, specifically the user's
        top items (such as top songs and artists). No other personal
        information, such as email, IP address, payment details, or real name
        (only Spotify username), is collected or stored.
        <h2 className="mt-8 text-lg lg:text-lg-lg">Types of Data Collected</h2>
        <ul className="list-disc list-inside text-sm">
          <li>
            Spotify Data: Information on your top items as provided by the
            Spotify API.
          </li>
        </ul>
        <h2 className="mt-8 text-lg lg:text-lg-lg">Use of Information</h2>I use
        the collected information solely to provide services on my Site, which
        involves displaying the user's top items from Spotify.
        <h2 className="mt-8 text-lg lg:text-lg-lg">Data Sharing</h2>I do not
        share your data with any third parties.
        <h2 className="mt-8 text-lg lg:text-lg-lg">Data Retention</h2>The
        collected data is retained until you request its deletion. You can
        contact me at
        <a href="mailto:nnourr.me@nnourr.me">nnourr.me@nnourr.me</a> to request
        data deletion.
        <h2 className="mt-8 text-lg lg:text-lg-lg">User Rights</h2>
        You have the following rights regarding your data:
        <ul className="list-disc list-inside text-sm">
          <li>
            Access and Correction: You can request access to and correction of
            your data.
          </li>
          <li>
            Deletion and Restriction: You can request the deletion or
            restriction of your data.
          </li>
          <li>Data Portability: You can request a copy of your data.</li>
          <li>
            Objection to Processing: You can object to how your data is
            processed.
          </li>
          To exercise these rights, please contact me at{" "}
          <a href="mailto:nnourr.me@nnourr.me">nnourr.me@nnourr.me</a>. Note
          that these actions will be performed manually.
        </ul>
        <h2 className="mt-8 text-lg lg:text-lg-lg">
          Cookies and Tracking Technologies
        </h2>
        I do not use cookies or any other tracking technologies on my Site.
        <h2 className="mt-8 text-lg lg:text-lg-lg">
          Changes to the Privacy Policy
        </h2>
        I will notify you of any changes to this privacy policy by posting the
        new policy on this page. Please review this policy periodically for any
        updates. This policy is effective as of June 23rd 2024.
        <h2 className="mt-8 text-lg lg:text-lg-lg">Contact Information</h2>
        If you have any questions about this privacy policy, please contact me
        at <a href="mailto:nnourr.me@nnourr.me">nnourr.me@nnourr.me</a> or visit{" "}
        <a href="https://nnourr.tech" target="_black" rel="noreferrer">
          nnourr.tech
        </a>
        .
      </div>
    </div>
  );
};
