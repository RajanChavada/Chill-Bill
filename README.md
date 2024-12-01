# Chill Bill

## The Inspiration

Our journey began with a shared struggle: navigating the overwhelming financial stress many in our generation face today. Unlike our parents and grandparents, who could **afford homes, start families, and build wealth without crushing economic barriers**, we contend with inflation, layoffs, and a hyper-competitive job market that feels insurmountable.

Yet, amidst these challenges, we found hope: while we can’t change the economy, we can change how we **manage our finances**. By building healthier financial habits, like budgeting and saving in alignment with our goals and **mental well-being**, we can **reclaim the dreams we feared were out of reach**.

This realization drives our project. We wanted to create a tool that not only empowers smarter financial decisions but also **supports the emotional burden tied to money management**, offering hope and progress to a generation ready to dream again.


## What it does

Our app, **Chill Bill**, is a financial wellness companion tailored for Gen Z, merging financial management with mental health support in a way that’s never been done before. The app begins by asking users the most important question of their day: **“How are you feeling?”** This sets the tone for an experience that acknowledges the emotional challenges tied to finances.

Chill Bill empowers users to track their daily spending with a **spending calendar**, where each day’s expenditures are linked to mood indicators (color-coded emojis). This allows users to visually connect their financial habits with their emotional well-being, fostering mindfulness in their decision-making.

To keep users motivated, Chill Bill incorporates **gamification** in the form of achievements and progress tracking. Users earn badges for milestones like building an emergency fund or sticking to a budget, and they can see their progress through a **percentage tracker and progress bar**. The app also uses points to reward consistent habits, making financial responsibility both engaging and rewarding.

Users can also set and work toward long-term goals, such as saving for a dream vacation, building a financial cushion, or even qualifying for a mortgage. The app offers actionable insights with **bite-sized financial advice and stress-reduction tips** based on spending habits, powered by intelligent **AI systems**.

Additionally, Chill Bill fosters a sense of community through **group challenges**, where users can collaborate to achieve shared goals like a “no-spend weekend” or a “30-day savings streak.” With features like **stress analysis**, **expert advice**, and **community support**, Chill Bill ensures students are **never alone in their journey** toward financial freedom and mental wellness.

## How we Built it

We started by experimenting with Tempolabs' software, which helped us quickly prototype the app. After refining the design and discussing functionalities with mentors and sponsors like Sun Life, we integrated several key technologies to bring our vision to life.

For real-time financial tracking and insights, we used Cloudflare Workers and AI-driven analysis via the Llama 2 language model. This allowed us to provide personalized financial advice based on users' spending patterns. We also leveraged Plaid’s API to securely connect to users’ financial accounts, enabling automatic updates of their spending in the app’s calendar.

Our front-end was built using React and TypeScript for a smooth, responsive user experience. We incorporated Auth0 for secure authentication, and Cloudflare handled our domain for reliable performance.

These technologies combined to create Chill Bill, an app that empowers Gen Z to manage their finances and improve their mental wellness.


## Challenges we ran into

First, we ran into issues with Tempolabs' AI chat, which initially didn't provide the right fixes for some of the errors we faced. Fortunately, we had the opportunity to speak directly with Kevin Michael, the CEO of Tempolabs, who helped us get the issues resolved. Additionally, we faced common development hurdles, such as git merge conflicts and instances where Tempolabs' AI chat was down or not running as expected.

One of our biggest challenges was identifying what sets Chill Bill apart from other financial apps. We didn’t want to simply be another budgeting tool—we aimed to be an all-in-one solution that addresses both the financial and mental health needs of Gen Z. To achieve this, we integrated Plaid's API to directly connect to users’ bank accounts. This feature automatically categorizes every transaction in real-time, eliminating the need for manual input and providing a seamless experience for users to track their spending.

## What we learned

We learned how to integrate Plaid’s API, which enabled us to seamlessly connect with users' financial data, streamlining the tracking of transactions and categorizing them automatically. This process taught us a lot about securely handling sensitive financial data.

Using Tempolabs for frontend design and development also taught us how AI tools can enhance productivity. Tempo Labs offers a code-based design tool that replaces traditional design platforms like Figma. It helped us scale our frontend development without needing extra hires, and their human-in-the-loop review process ensured we maintained high-quality output.

We also faced challenges in managing and resolving git merge conflicts as a team, which honed our collaboration skills and taught us the importance of clear communication.

Deploying Cloudflare workers was another valuable learning experience. It allowed us to implement scalable server-side logic with minimal overhead. Additionally, integrating Auth0 for user authentication taught us how to securely manage user logins and account data, enhancing both user experience and app security.

## What's next for our project

Chill Bill is set to revolutionize financial and mental health management for Gen Z, a demographic of over 5 million students in Canada alone seeking practical financial tools. With the mental health app market projected to grow to $17 billion by 2030, the opportunity to blend financial empowerment with mental wellness has never been greater.

Our upcoming developments include seamless integration with digital wallets like Apple Pay and banking apps. Transactions will automatically sync with Chill Bill's spending calendar in real-time, providing instant updates on daily and monthly spending. This ensures users stay informed and on track with their financial goals effortlessly.

We also aim to expand our gamification features with more personalized challenges, group savings options, and enhanced rewards systems. Partnerships with financial institutions will provide access to exclusive resources, while expert-led webinars and mentorship programs will strengthen community support.

Chill Bill is not just an app—it’s a movement to redefine financial freedom and mental well-being for a generation ready to thrive.

## Built With

Cloudflare workers and AI LLM Llama 2, Plaid API, Tempolabs, React, Typescript, Auth0, Cloudflare domain


