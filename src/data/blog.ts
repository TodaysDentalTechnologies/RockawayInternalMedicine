export interface BlogSection {
  heading: string
  paragraphs: string[]
}

export interface BlogPost {
  slug: string
  title: string
  category: string
  /** ISO date, `YYYY-MM-DD`. */
  date: string
  readMinutes: number
  img: string
  excerpt: string
  /** Lead paragraphs shown before the first section heading. */
  intro: string[]
  sections: BlogSection[]
  faqs: { q: string; a: string }[]
  /** Optional related service slug to cross-link. */
  relatedServiceSlug?: string
  disclaimer?: string
}

export const posts: BlogPost[] = [
  {
    slug: 'diabetes-causes-symptoms-types-and-treatment',
    title: 'Diabetes: Causes, Symptoms, Types, and Effective Treatment Options',
    category: 'Diabetes',
    date: '2026-07-27',
    readMinutes: 6,
    img: '/images/blog-diabetes-cover.jpg',
    excerpt:
      'Diabetes raises blood sugar when the body can’t make or use insulin well. Here’s what causes it, the warning signs to watch for, the three main types, and how it’s managed day to day.',
    intro: [
      'Diabetes is a chronic metabolic condition that raises blood sugar — a state doctors call hyperglycemia. It happens when the pancreas doesn’t make enough insulin, stops making it altogether, or when the body can’t use insulin effectively (insulin resistance).',
      'Food breaks down into glucose, and when insulin isn’t doing its job, that glucose builds up in the bloodstream. Common warning signs include increased thirst, frequent urination, fatigue, and increased hunger. There’s no cure, but with monitoring, the right medication, and steady lifestyle changes, blood sugar can be managed well — lowering the risk of long-term complications.',
    ],
    sections: [
      {
        heading: 'What is diabetes?',
        paragraphs: [
          'Diabetes is a chronic condition that occurs when blood glucose rises too high. In people affected by it, the pancreas may not produce enough insulin, or the insulin it makes may not work properly.',
          'Understanding the causes, the symptoms, and the main types is the first step toward managing it — and there are effective treatment options that combine medication with everyday lifestyle changes.',
        ],
      },
      {
        heading: 'Causes, risk factors, and warning signs',
        paragraphs: [
          'High blood sugar develops when the body struggles to manage glucose. A primary cause is the pancreas not producing enough insulin — or any at all — and sometimes the body simply can’t use the insulin it produces.',
          'Genetics play a significant role: a family history of diabetes raises your risk. So do lifestyle factors like a diet high in sugar, limited physical activity, and the weight gain and obesity that can follow. Chronic stress also affects how well the body uses insulin.',
          'Certain groups face higher risk, including people with close relatives who have diabetes, those who are overweight, and older adults. Rates are also higher among African American, Hispanic American, American Indian, and some Asian American communities.',
          'The warning signs to watch for are increased thirst, frequent urination, fatigue, and increased hunger despite eating enough. These tend to become more pronounced over time — and catching them early makes diabetes far easier to manage.',
        ],
      },
      {
        heading: 'The main types of diabetes',
        paragraphs: [
          'Type 1 diabetes occurs when the pancreas produces no insulin at all. It usually appears in childhood or early adulthood, and people with it need insulin injections to manage their blood sugar. Genetics can raise the risk, though the exact cause isn’t fully understood.',
          'Type 2 diabetes is the most common form and usually develops in adulthood, often tied to weight and inactivity. Here the body either doesn’t make enough insulin or can’t use it effectively, and symptoms like thirst and fatigue set in as blood sugar rises.',
          'Gestational diabetes appears during [pregnancy](/services/pregnancy-testing) in women who haven’t had diabetes before. Blood sugar typically returns to normal after childbirth, but it does raise the chance of developing Type 2 diabetes later in life. Each type calls for a management plan tailored to its onset and symptoms.',
        ],
      },
      {
        heading: 'Proven, effective treatment options',
        paragraphs: [
          'Managing diabetes well usually combines three things: medication, lifestyle changes, and regular blood-sugar monitoring. Insulin or other medicines help the body use glucose properly, while daily monitoring shows how your body responds to different foods and activities so your plan can be adjusted.',
          'Diet is central. Whole grains, fruits, vegetables, and lean proteins help keep glucose steady, and watching carbohydrate intake matters because it affects blood sugar directly. Smaller meals through the day can curb hunger and prevent spikes.',
          'Movement matters just as much. Around 150 minutes of moderate activity a week — even simple walking or cycling — meaningfully reduces insulin resistance, which especially helps people with Type 2 diabetes.',
        ],
      },
      {
        heading: 'The latest in diabetes care',
        paragraphs: [
          'Newer tools have made day-to-day management easier. Continuous glucose monitors track blood sugar without constant finger pricks and alert you in real time when levels run high or low. Modern insulin pumps deliver precise, adjustable dosing based on activity and food.',
          'Paired with tailored nutrition and exercise plans, these advances help people lead healthier lives while staying on top of a lifelong condition. The best next step is simple: book a visit so we can assess where you stand and build the plan that fits you.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What causes diabetes?',
        a: 'Diabetes develops when the body can’t use insulin well or can’t make enough of it. In Type 1, the body stops making insulin; in Type 2, cells resist it. Risk factors include weight, family history, diet, and low activity.',
      },
      {
        q: 'What are the symptoms of diabetes?',
        a: 'Common symptoms include increased thirst, tiredness, frequent urination, blurred vision, and slow-healing wounds — signs of high blood sugar (hyperglycemia). See a doctor if you notice these.',
      },
      {
        q: 'What types of diabetes exist?',
        a: 'The main types are Type 1 (often starting in youth and needing insulin) and Type 2 (linked to diet and lifestyle). Gestational diabetes occurs in pregnancy, and a few less common types also exist.',
      },
      {
        q: 'How is diabetes treated and managed?',
        a: 'Treatment aims to control blood sugar and lower risk factors — it may include insulin or other medicines, a healthy diet, and regular exercise. Because diabetes is chronic, care and regular testing continue over time.',
      },
    ],
    relatedServiceSlug: 'diabetes-management',
    disclaimer:
      'This article is for general education and isn’t a substitute for personalized medical advice. Talk with your provider about your specific situation.',
  },
]

export const getPost = (slug?: string): BlogPost | undefined => posts.find((p) => p.slug === slug)
