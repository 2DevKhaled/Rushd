import { Globe, Mail, MapPin, Phone } from "lucide-react";

const formatDate = (date) => {
  if (!date) return "";
  const [year, month] = String(date).split("-");
  if (!year || !month) return date;
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

const SectionTitle = ({ children, accentColor }) => (
  <h2
    className="mb-4 border-b pb-2 text-sm font-black uppercase tracking-[0.25em]"
    style={{ color: accentColor, borderColor: `${accentColor}55` }}
  >
    {children}
  </h2>
);

const ContactItem = ({ icon: Icon, value }) => {
  if (!value) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4" />
      <span className="break-all">{value}</span>
    </div>
  );
};

const splitDescription = (description) =>
  String(description || "")
    .split(/\n|•/)
    .map((item) => item.trim())
    .filter(Boolean);

const chunkText = (text, sizes) => {
  const chunks = [];
  let cursor = 0;

  sizes.forEach((size) => {
    if (text.slice(cursor, cursor + size)) {
      chunks.push(text.slice(cursor, cursor + size));
    }
    cursor += size;
  });

  if (text.slice(cursor)) {
    chunks.push(text.slice(cursor));
  }

  return chunks.join(" ");
};

const formatPhoneNumber = (phone) => {
  const rawPhone = String(phone || "").trim();
  const digits = rawPhone.replace(/\D/g, "");

  if (!digits) return rawPhone;

  const hasKnownCountryCode =
    rawPhone.startsWith("+") || digits.startsWith("966") || digits.startsWith("967");

  if (hasKnownCountryCode && digits.length > 3) {
    const countryCode = digits.slice(0, 3);
    const localNumber = digits.slice(3);
    const localGroups =
      countryCode === "966" && localNumber.length === 9
        ? chunkText(localNumber, [2, 3, 4])
        : chunkText(localNumber, [3, 3, 4]);

    return `+${countryCode} ${localGroups}`;
  }

  if (digits.length === 9) {
    return chunkText(digits, [3, 3, 3]);
  }

  if (digits.length === 10) {
    return chunkText(digits, [3, 3, 4]);
  }

  return rawPhone;
};

const AtsSectionTitle = ({ children }) => (
  <h2 className="mb-2 border-b border-zinc-900 pb-1 text-[15px] font-bold uppercase tracking-wide text-zinc-950">
    {children}
  </h2>
);

const AtsBullets = ({ text }) => {
  const bullets = splitDescription(text);
  if (bullets.length === 0) return null;

  return (
    <ul className="mt-1 list-disc space-y-1 pl-5 text-[13px] leading-5 text-zinc-900">
      {bullets.map((bullet, index) => (
        <li key={index}>{bullet}</li>
      ))}
    </ul>
  );
};

const ClassicAtsResume = ({ resume }) => {
  const personal = resume?.personalInfo || {};
  const contactItems = [
    { value: formatPhoneNumber(personal.phone), ltr: true },
    { value: personal.email, ltr: true },
    { value: personal.linkedin, ltr: true },
    { value: personal.website, ltr: true },
    { value: personal.location, ltr: false },
  ].filter((item) => item.value);

  return (
    <div
      id="resume-preview"
      dir="ltr"
      className="mx-auto min-h-[1056px] w-full max-w-[816px] bg-white px-12 py-10 text-left font-serif text-zinc-950 shadow-2xl shadow-black/30 print:min-h-0 print:max-w-none print:shadow-none"
    >
      <style>
        {`
          @media print {
            @page { margin: 0.45in; size: letter; }
            body * { visibility: hidden; }
            #resume-preview, #resume-preview * { visibility: visible; }
            #resume-preview {
              position: absolute;
              inset: 0;
              width: 100%;
              box-shadow: none;
              padding: 0;
            }
          }
        `}
      </style>

      <header className="mb-5 text-center">
        <h1 className="text-[26px] font-bold leading-tight text-zinc-950">
          {personal.fullName || "Your Name"}
        </h1>
        {personal.profession && (
          <p className="mt-1 text-[13px] font-bold text-zinc-900">
            {personal.profession}
          </p>
        )}
        <p className="mt-1 flex flex-wrap justify-center gap-x-1 text-[11px] text-zinc-800">
          {contactItems.map((item, index) => (
            <span key={`${item.value}-${index}`} className="inline-flex items-center gap-x-1">
              {index > 0 && <span>|</span>}
              <bdi
                dir={item.ltr ? "ltr" : "auto"}
                className="whitespace-nowrap tabular-nums"
                style={{ unicodeBidi: "isolate" }}
              >
                {item.value}
              </bdi>
            </span>
          ))}
        </p>
      </header>

      {resume?.professionalSummary && (
        <section className="mb-4">
          <AtsSectionTitle>Summary</AtsSectionTitle>
          <p className="text-[13px] leading-5 text-zinc-900">{resume.professionalSummary}</p>
        </section>
      )}

      {resume?.education?.length > 0 && (
        <section className="mb-4">
          <AtsSectionTitle>Education</AtsSectionTitle>
          <div className="space-y-2">
            {resume.education.map((item, index) => (
              <div key={index}>
                <div className="flex items-start justify-between gap-4 text-[13px]">
                  <div>
                    <h3 className="font-bold">{item.institution}</h3>
                    <p className="italic">
                      {[item.degree, item.field].filter(Boolean).join(" in ")}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p>{formatDate(item.graduationDate)}</p>
                    {item.gpa && <p>GPA: {item.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume?.experience?.length > 0 && (
        <section className="mb-4">
          <AtsSectionTitle>Experience</AtsSectionTitle>
          <div className="space-y-3">
            {resume.experience.map((item, index) => (
              <div key={index}>
                <div className="flex items-start justify-between gap-4 text-[13px]">
                  <div>
                    <h3 className="font-bold">{item.position || "Position"}</h3>
                    <p className="italic">{item.company}</p>
                  </div>
                  <p className="shrink-0 text-right">
                    {formatDate(item.startDate)}
                    {(item.startDate || item.endDate || item.isCurrent) && " - "}
                    {item.isCurrent ? "Present" : formatDate(item.endDate)}
                  </p>
                </div>
                <AtsBullets text={item.description} />
              </div>
            ))}
          </div>
        </section>
      )}

      {resume?.projects?.length > 0 && (
        <section className="mb-4">
          <AtsSectionTitle>Projects</AtsSectionTitle>
          <div className="space-y-3">
            {resume.projects.map((item, index) => (
              <div key={index}>
                <div className="flex items-start justify-between gap-4 text-[13px]">
                  <h3 className="font-bold">
                    {item.name || "Project"}
                    {item.type && <span className="font-normal"> | {item.type}</span>}
                  </h3>
                </div>
                <AtsBullets text={item.description} />
              </div>
            ))}
          </div>
        </section>
      )}

      {resume?.skills?.length > 0 && (
        <section className="mb-4">
          <AtsSectionTitle>Technical Skills</AtsSectionTitle>
          <p className="text-[13px] leading-5 text-zinc-900">
            <span className="font-bold">Skills: </span>
            {resume.skills.join(", ")}
          </p>
        </section>
      )}

      {resume?.languages?.length > 0 && (
        <section>
          <AtsSectionTitle>Languages</AtsSectionTitle>
          <div className="space-y-1 text-[13px] leading-5 text-zinc-900">
            {resume.languages
              .filter((language) => language.name || language.proficiency)
              .map((language, index) => (
                <p key={index}>
                  <span className="font-bold">{language.name || "Language"}</span>
                  {language.proficiency && ` (${language.proficiency})`}
                </p>
              ))}
          </div>
        </section>
      )}
    </div>
  );
};

function ResumePreview({ resume, className = "" }) {
  const accentColor = resume?.accentColor || "#111827";
  const personal = resume?.personalInfo || {};
  const isClassic = !resume?.template || resume?.template === "classic";
  const isModern = resume?.template === "modern";
  const isMinimal = resume?.template === "minimal";

  if (isClassic) {
    return <ClassicAtsResume resume={resume} />;
  }

  return (
    <div
      id="resume-preview"
      dir="ltr"
      className={`mx-auto w-full max-w-4xl overflow-hidden bg-white text-left text-zinc-800 shadow-2xl shadow-black/30 print:shadow-none ${className}`}
    >
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #resume-preview, #resume-preview * { visibility: visible; }
            #resume-preview { position: absolute; inset: 0; width: 100%; max-width: none; }
          }
        `}
      </style>

      <header
        className={isModern ? "p-8 text-white" : "border-b p-8 text-center"}
        style={{
          backgroundColor: isModern ? accentColor : "white",
          borderColor: `${accentColor}88`,
        }}
      >
        {personal.image && (
          <img
            src={typeof personal.image === "string" ? personal.image : URL.createObjectURL(personal.image)}
            alt={personal.fullName || "Profile"}
            className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
          />
        )}
        <h1 className="text-4xl font-black" style={{ color: isModern ? "white" : accentColor }}>
          {personal.fullName || "Your Name"}
        </h1>
        <p className="mt-2 text-lg text-zinc-600" style={{ color: isModern ? "white" : undefined }}>
          {personal.profession || "Professional Title"}
        </p>
        <div
          className={`mt-5 flex flex-wrap justify-center gap-4 ${
            isModern ? "text-white" : "text-zinc-600"
          }`}
        >
          <ContactItem icon={Mail} value={personal.email} />
          <ContactItem icon={Phone} value={personal.phone} />
          <ContactItem icon={MapPin} value={personal.location} />
          <ContactItem icon={Globe} value={personal.linkedin} />
          <ContactItem icon={Globe} value={personal.website} />
        </div>
      </header>

      <main className={isMinimal ? "p-10" : "p-8"}>
        {resume?.professionalSummary && (
          <section className="mb-8">
            <SectionTitle accentColor={accentColor}>Summary</SectionTitle>
            <p className="leading-8 text-zinc-700">{resume.professionalSummary}</p>
          </section>
        )}

        {resume?.experience?.length > 0 && (
          <section className="mb-8">
            <SectionTitle accentColor={accentColor}>Experience</SectionTitle>
            <div className="space-y-5">
              {resume.experience.map((item, index) => (
                <div key={index} className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black">{item.position}</h3>
                      <p className="font-semibold text-zinc-600">{item.company}</p>
                    </div>
                    <p className="text-sm text-zinc-500">
                      {formatDate(item.startDate)} - {item.isCurrent ? "Present" : formatDate(item.endDate)}
                    </p>
                  </div>
                  <p className="mt-2 whitespace-pre-line leading-7 text-zinc-700">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {resume?.projects?.length > 0 && (
          <section className="mb-8">
            <SectionTitle accentColor={accentColor}>Projects</SectionTitle>
            <div className="space-y-4">
              {resume.projects.map((item, index) => (
                <div key={index}>
                  <h3 className="font-black">{item.name}</h3>
                  <p className="text-sm font-semibold" style={{ color: accentColor }}>
                    {item.type}
                  </p>
                  <p className="mt-1 leading-7 text-zinc-700">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {resume?.education?.length > 0 && (
            <section>
              <SectionTitle accentColor={accentColor}>Education</SectionTitle>
              <div className="space-y-4">
                {resume.education.map((item, index) => (
                  <div key={index}>
                    <h3 className="font-black">{item.degree}</h3>
                    <p className="text-zinc-700">{item.institution}</p>
                    <p className="text-sm text-zinc-500">
                      {item.field} {item.graduationDate && `• ${formatDate(item.graduationDate)}`}
                    </p>
                    {item.gpa && <p className="text-sm text-zinc-500">GPA: {item.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {resume?.skills?.length > 0 && (
            <section>
              <SectionTitle accentColor={accentColor}>Skills</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full px-3 py-1 text-sm font-semibold text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {resume?.languages?.length > 0 && (
            <section>
              <SectionTitle accentColor={accentColor}>Languages</SectionTitle>
              <div className="space-y-2 text-zinc-700">
                {resume.languages
                  .filter((language) => language.name || language.proficiency)
                  .map((language, index) => (
                    <p key={index} className="block">
                      <span className="font-black">{language.name || "Language"}</span>
                      {language.proficiency && ` (${language.proficiency})`}
                    </p>
                  ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default ResumePreview;
