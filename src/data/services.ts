export interface Faq {
  q: string
  a: string
}

export interface ServiceItem {
  slug: string
  category: string
  title: string
  img: string
  body: string
  faqs: Faq[]
}

// Photos live in /public/images (note the double .jpg.jpeg extension).
export const services: ServiceItem[] = [
  {
    slug: 'cardiology',
    category: 'Cardiovascular',
    title: 'Cardiology',
    img: '/images/cardiology.jpg.jpeg',
    body: 'Heart-health evaluations, blood-pressure and cholesterol management, EKG, and coordinated cardiac care with trusted specialists.',
    faqs: [
      { q: 'When should I see someone about heart health?', a: "If you have symptoms like chest pain, shortness of breath, palpitations, or risk factors like high blood pressure or a family history of heart disease, it's worth being evaluated." },
      { q: 'What tests are used to check heart health?', a: 'We start with a history and exam, blood pressure, and an in-office EKG, then order bloodwork or specialist imaging when it is warranted.' },
      { q: 'Can heart disease be prevented?', a: 'Often, yes — managing blood pressure, cholesterol, blood sugar, weight, and smoking dramatically lowers your risk, and we build a plan around your numbers.' },
      { q: 'Do you treat heart conditions directly or refer out?', a: 'We manage everyday cardiovascular care here and coordinate closely with trusted cardiologists for anything that needs a specialist.' },
      { q: 'How often should heart health be reassessed?', a: 'For most adults, at least yearly — more often if you are managing an active condition or adjusting medication.' },
    ],
  },
  {
    slug: 'diabetes-management',
    category: 'Metabolic',
    title: 'Diabetes Management',
    img: '/images/diabetes.jpg.jpeg',
    body: 'Blood-sugar monitoring, A1C testing, nutrition counseling, and long-term control plans built around your life.',
    faqs: [
      { q: "How do I know if I'm at risk for diabetes?", a: 'Risk factors include family history, extra weight, high blood pressure, and being over 45 — a simple blood test (A1C or fasting glucose) tells us where you stand.' },
      { q: 'What does diabetes management involve here?', a: 'Regular A1C checks, medication when needed, nutrition counseling, and monitoring for complications — all coordinated in one place.' },
      { q: 'Can type 2 diabetes be reversed?', a: 'Many people bring their blood sugar back to a healthy range with food, movement, and weight changes — we set realistic, personalized targets.' },
      { q: 'How often will I need to come in?', a: 'Usually every three months while we fine-tune control, then less often once your numbers are steady.' },
    ],
  },
  {
    slug: 'hypertension-treatment',
    category: 'Cardiovascular',
    title: 'Hypertension Treatment',
    img: '/images/hypertension.jpg.jpeg',
    body: 'Personalized blood-pressure control — lifestyle guidance, medication management, and steady monitoring to protect your heart.',
    faqs: [
      { q: 'What counts as high blood pressure?', a: 'Generally a reading at or above 130/80 on more than one occasion — we confirm with proper, repeated measurements before diagnosing.' },
      { q: 'Will I need medication?', a: 'Not always — mild cases often respond to diet, activity, and stress changes; when medication helps, we start low and adjust carefully.' },
      { q: 'Is high blood pressure dangerous if I feel fine?', a: 'Yes — it usually has no symptoms but quietly raises the risk of heart attack, stroke, and kidney damage, which is why we monitor it closely.' },
      { q: 'How often should it be checked?', a: 'At every visit, plus home readings we review together to make sure your treatment is working.' },
    ],
  },
  {
    slug: 'cholesterol-testing',
    category: 'Cardiovascular',
    title: 'Cholesterol Testing',
    img: '/images/cholesterol.jpg.jpeg',
    body: 'Complete lipid panels and treatment to assess cardiovascular risk and prevent complications before they start.',
    faqs: [
      { q: 'How often should I check my cholesterol?', a: 'Most adults every four to six years, and more often with heart-disease risk factors or if you are on treatment.' },
      { q: 'Do I need to fast before the test?', a: 'Sometimes — for a full lipid panel we may ask you to fast 9–12 hours, and we will tell you in advance.' },
      { q: 'What if my cholesterol is high?', a: 'We weigh your overall risk and start with lifestyle changes, adding a statin or other medication only when it is clearly warranted.' },
      { q: 'Can diet alone fix high cholesterol?', a: 'For some people, yes — for others genetics play a big role, so we tailor the plan to your numbers and history.' },
    ],
  },
  {
    slug: 'thyroid-treatment',
    category: 'Endocrine',
    title: 'Thyroid Treatment',
    img: '/images/thyroid.jpg.jpeg',
    body: 'Diagnosis and management of hypo- and hyperthyroid conditions, with careful testing and dosing that keep you balanced.',
    faqs: [
      { q: 'What are the signs of a thyroid problem?', a: 'Fatigue, weight changes, feeling too hot or cold, hair changes, or mood shifts can all point to an under- or overactive thyroid.' },
      { q: 'How is thyroid disease diagnosed?', a: 'A simple blood test (TSH, and sometimes T4/T3) tells us how your thyroid is working; we may check antibodies too.' },
      { q: 'Is thyroid medication lifelong?', a: 'Often yes for an underactive thyroid, but doses are adjustable — we recheck labs and fine-tune until you feel like yourself.' },
      { q: 'How often will my levels be checked?', a: 'Every 6–12 weeks while adjusting, then once or twice a year when stable.' },
    ],
  },
  {
    slug: 'cancer-screening',
    category: 'Preventive',
    title: 'Cancer Screening',
    img: '/images/cancer-screening.jpg.jpeg',
    body: 'Guideline-based screenings for early detection — because catching things early is what saves lives.',
    faqs: [
      { q: 'Which cancer screenings do I need?', a: 'It depends on your age, sex, and risk — common ones include colorectal, breast, cervical, lung, and skin; we build a schedule for you.' },
      { q: 'When should screening start?', a: 'Guidelines vary by test, but many begin between 40 and 50 — sooner if you have a family history or other risk factors.' },
      { q: 'Do you perform screenings here or refer out?', a: 'We handle screening labs and exams in-office and coordinate imaging or specialist procedures when they are needed.' },
      { q: 'Why is early detection so important?', a: 'Many cancers are far more treatable — and curable — when caught before symptoms appear, which is the whole point of screening.' },
    ],
  },
  {
    slug: 'neurology',
    category: 'Neurological',
    title: 'Neurology',
    img: '/images/neurology.jpg.jpeg',
    body: 'Evaluation and management of headaches, migraines, nerve pain, and other neurological conditions.',
    faqs: [
      { q: 'What conditions do you evaluate?', a: 'Headaches and migraines, dizziness, numbness or tingling, memory concerns, and other nervous-system symptoms.' },
      { q: 'When should I worry about headaches?', a: 'Sudden severe headaches, ones with vision or speech changes, or a new pattern after age 50 deserve prompt evaluation.' },
      { q: 'Will I need a scan?', a: 'Not always — many issues are diagnosed by history and exam; we order imaging or refer to a neurologist when it is warranted.' },
      { q: 'Can migraines be prevented?', a: 'Often yes — identifying triggers plus the right daily or rescue plan can meaningfully cut how often they hit.' },
    ],
  },
  {
    slug: 'dermatology',
    category: 'Skin Health',
    title: 'Dermatology',
    img: '/images/dermatology.jpg.jpeg',
    body: 'Care for rashes, acne, moles, and common skin conditions — with referrals to specialists when needed.',
    faqs: [
      { q: 'What skin issues can you treat?', a: 'Rashes, acne, eczema, infections, and suspicious moles or growths — with dermatology referrals for anything specialized.' },
      { q: 'When should I get a mole checked?', a: 'If it changes in size, shape, or color, itches, or bleeds — those changes are worth a look promptly.' },
      { q: 'Do you do skin-cancer checks?', a: 'We perform full-skin exams and biopsies when needed, and coordinate with dermatology for treatment.' },
      { q: 'How soon can I be seen for a rash?', a: 'Usually within the week — new or spreading rashes should not wait.' },
    ],
  },
  {
    slug: 'immunotherapy',
    category: 'Allergy & Immune',
    title: 'Immunotherapy',
    img: '/images/immunotherapy.jpg.jpeg',
    body: 'Allergy and immune-system treatment coordinated under expert medical supervision.',
    faqs: [
      { q: 'What is immunotherapy used for?', a: "Severe allergies, allergic asthma, hay fever, and certain immune conditions that don't respond to standard treatment." },
      { q: 'How does it work?', a: 'It gradually trains your immune system to tolerate triggers, reducing reactions over time under close supervision.' },
      { q: 'Is it right for me?', a: 'We evaluate your history and testing first, then coordinate specialized immunotherapy when it is the best fit.' },
      { q: 'Are there side effects?', a: 'Most are mild and local; we monitor you carefully and adjust the plan to keep it safe.' },
    ],
  },
  {
    slug: 'physicals-vaccinations',
    category: 'Preventive',
    title: 'Physicals & Vaccinations',
    img: '/images/immunizations.jpg.jpeg',
    body: 'School, work, and travel physicals plus flu, pneumonia, shingles, and tetanus immunizations kept on schedule.',
    faqs: [
      { q: "What's included in a physical?", a: 'A head-to-toe exam, vitals, age-appropriate labs and screenings, a medication review, and time to talk through your health.' },
      { q: 'Which vaccines do you offer?', a: 'Flu, pneumonia, shingles, tetanus/Tdap, and others — plus school, work, and travel requirements.' },
      { q: 'Do you complete school and work forms?', a: 'Yes — bring your forms to the visit and we will handle the exam and paperwork together.' },
      { q: 'How often do I need a physical?', a: 'Most adults yearly; we will advise more often if you are managing a chronic condition.' },
    ],
  },
  {
    slug: 'pain-management',
    category: 'Pain & Mobility',
    title: 'Pain Management',
    img: '/images/pain-management.jpg.jpeg',
    body: 'Practical plans for chronic pain and migraine relief that keep you moving — not just medicated.',
    faqs: [
      { q: 'What kinds of pain do you treat?', a: 'Chronic back, joint, and nerve pain, arthritis, and recurring migraines — with a focus on keeping you active.' },
      { q: 'Will I just be given medication?', a: 'No — we look for the cause and combine practical strategies, therapy referrals, and medication only when appropriate.' },
      { q: 'When should I seek help for pain?', a: 'When it limits daily activities, lasts more than a few weeks, or keeps returning despite home care.' },
      { q: 'Do you coordinate with specialists?', a: 'Yes — we manage day-to-day pain care and bring in physical therapy or specialists when it helps.' },
    ],
  },
  {
    slug: 'pregnancy-testing',
    category: "Women's Health",
    title: 'Pregnancy Testing',
    img: '/images/pregnancy.jpg.jpeg',
    body: 'Confidential pregnancy testing and family-planning guidance in a comfortable, supportive environment.',
    faqs: [
      { q: 'Is testing confidential?', a: 'Completely — we provide pregnancy testing and counseling in a private, judgment-free environment.' },
      { q: 'How soon can pregnancy be detected?', a: 'A urine test is usually accurate about a week after a missed period; we can confirm with a blood test if needed.' },
      { q: 'What happens after the result?', a: 'We talk through your options and next steps and connect you with the right prenatal or family-planning care.' },
      { q: 'Do you offer family-planning guidance?', a: 'Yes — including contraception counseling tailored to your needs and goals.' },
    ],
  },
]

export function getService(slug: string | undefined): ServiceItem | undefined {
  return services.find((s) => s.slug === slug)
}
