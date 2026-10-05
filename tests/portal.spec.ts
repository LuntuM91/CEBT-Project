import { test, expect, type Page } from '@playwright/test';

async function demo(page: Page, role: 'Job seeker' | 'Employer' | 'CEBT admin') {
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('button', { name: new RegExp(`^${role}`) }).click();
}
async function signout(page: Page) { await page.getByRole('button', { name: 'Sign out', exact: true }).first().click(); }

test.beforeEach(async ({ page }) => { await page.goto('/'); });

test('homepage, search typing and combined filters work', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e=>errors.push(e.message));
  await expect(page.getByRole('heading', { name: /Connecting Carolina/ })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search opportunities' }).pressSequentially('Diesel');
  await expect(page.getByRole('textbox', { name: 'Search opportunities' })).toHaveValue('Diesel');
  await page.getByRole('button', { name: 'Find opportunities', exact: true }).last().click();
  await expect(page.locator('.listing-results .job-card')).toHaveCount(1);
  await page.getByLabel('Location', { exact: true }).selectOption('Ermelo');
  await expect(page.getByText('No opportunities match yet')).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.listing-results .job-card')).toHaveCount(10);
  await page.getByRole('radio', { name: 'Learnership', exact: false }).check();
  await expect(page.locator('.listing-results .job-card')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('candidate applies once, tracks application and persists saved jobs', async ({ page }) => {
  await demo(page, 'Job seeker');
  await page.getByRole('button', { name: 'Find opportunities', exact: true }).first().click();
  await page.getByRole('button', { name: 'Save Electrician – Industrial', exact: true }).click();
  await page.getByRole('button', { name: 'View Electrician – Industrial', exact: true }).click();
  await page.getByRole('textbox', { name: /Tell the employer/ }).fill('I have relevant technical experience.');
  await page.getByRole('button', { name: 'Apply for this opportunity' }).click();
  await expect(page.getByRole('heading', { name: 'My applications', exact: true })).toBeVisible();
  await expect(page.locator('tbody tr').filter({ hasText: 'Electrician – Industrial' })).toContainText('Submitted');
  await page.getByRole('button', { name: 'Find opportunities', exact: true }).first().click();
  await page.getByRole('button', { name: 'View Electrician – Industrial', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Application submitted', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'My dashboard' }).click();
  await page.getByRole('button', { name: 'Saved opportunities', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Electrician – Industrial', exact: true })).toBeVisible();
});

test('candidate edits profile and uploads downloadable CV', async ({ page }) => {
  await demo(page, 'Job seeker');
  await page.getByRole('button', { name: 'My profile', exact: true }).click();
  await page.getByRole('textbox', { name: 'Contact number', exact: true }).fill('072 123 4567');
  await page.getByRole('textbox', { name: 'Skills', exact: true }).fill('Diesel Mechanic, Safety, Excel');
  await page.getByLabel('Upload CV').setInputFiles({ name: 'Demo_CV.txt', mimeType: 'text/plain', buffer: Buffer.from('Fictional CV for CEBT testing') });
  await page.getByRole('button', { name: 'Save my profile' }).click();
  await expect(page.getByRole('status')).toContainText('Profile saved');
  await expect(page.locator('.cv-file')).toContainText('Demo_CV.txt');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download my CV' }).click();
  expect((await download).suggestedFilename()).toBe('Demo_CV.txt');
  await expect(page.locator('.profile-form')).toContainText('Awaiting review');
  await page.reload();
  await page.getByRole('button', { name: 'My dashboard' }).click();
  await page.getByRole('button', { name: 'My profile', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Contact number', exact: true })).toHaveValue('072 123 4567');
});

test('employer posts, edits and closes a vacancy', async ({ page }) => {
  await demo(page, 'Employer');
  await page.getByRole('button', { name: 'Post a vacancy', exact: true }).click();
  await page.getByRole('textbox', { name: 'Opportunity title', exact: true }).fill('Workshop Supervisor');
  await page.getByLabel('Closing date', { exact: true }).fill('2030-12-31');
  await page.getByRole('textbox', { name: 'Salary / stipend', exact: true }).fill('R25,000 / month');
  await page.getByRole('textbox', { name: 'About the opportunity', exact: true }).fill('Lead a workshop team in Carolina.');
  await page.getByRole('textbox', { name: 'Requirements', exact: true }).fill('Trade Test\n3 years experience');
  await page.getByRole('textbox', { name: 'Required skills', exact: true }).fill('Maintenance, Safety');
  await page.getByRole('button', { name: 'Post opportunity', exact: true }).click();
  await expect(page.locator('tbody tr').filter({ hasText: 'Workshop Supervisor' })).toContainText('Active');
  await page.getByRole('button', { name: 'Edit Workshop Supervisor' }).click();
  await page.getByRole('textbox', { name: 'Opportunity title', exact: true }).fill('Senior Workshop Supervisor');
  await page.getByRole('button', { name: 'Save opportunity', exact: true }).click();
  await page.locator('tbody tr').filter({ hasText: 'Senior Workshop Supervisor' }).getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.locator('tbody tr').filter({ hasText: 'Senior Workshop Supervisor' })).toContainText('Closed');
  await page.getByRole('button', { name: 'Find opportunities', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Senior Workshop Supervisor', exact: true })).toHaveCount(0);
});

test('employer schedules an interview and records placement, candidate sees updates', async ({ page }) => {
  await demo(page, 'Employer');
  await page.getByRole('button', { name: 'Applicants', exact: true }).click();
  await page.getByRole('button', { name: 'View application for Diesel Mechanic by Thandi M.', exact: true }).click();
  await page.getByLabel('Recruitment stage', { exact: true }).selectOption('Interview');
  await page.getByLabel('Interview date and time', { exact: true }).fill('2030-10-08T10:00');
  await page.getByRole('textbox', { name: 'Interview details / notes', exact: true }).fill('Meet at the Carolina workshop.');
  await page.getByRole('button', { name: 'Save recruitment update' }).click();
  await expect(page.getByRole('dialog')).toContainText('Meet at the Carolina workshop.');
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await signout(page);
  await demo(page, 'Job seeker');
  await page.getByRole('button', { name: 'My applications', exact: true }).click();
  await expect(page.locator('tbody tr').filter({ hasText: 'Diesel Mechanic' })).toContainText('Interview');
  await page.getByRole('button', { name: 'View application for Diesel Mechanic by Thandi M.', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Meet at the Carolina workshop.');
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await signout(page);
  await demo(page, 'Employer');
  await page.getByRole('button', { name: 'Applicants', exact: true }).click();
  await page.getByRole('button', { name: 'View application for Diesel Mechanic by Thandi M.', exact: true }).click();
  await page.getByLabel('Recruitment stage', { exact: true }).selectOption('Successful');
  await page.getByRole('button', { name: 'Save recruitment update' }).click();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: 'Overview', exact: true }).click();
  await expect(page.locator('.metric').filter({ hasText: 'Successful placements' }).locator('strong')).toHaveText('1');
});

test('admin verifies employers and candidates, analytics reflects real demo data', async ({ page }) => {
  await demo(page, 'CEBT admin');
  await page.getByRole('button', { name: 'Employers', exact: true }).click();
  await page.getByLabel('Filter employer verification').selectOption('pending');
  const trust = page.locator('.person-card').filter({ hasText: 'Siyakhula Community Trust' });
  await trust.getByRole('button', { name: 'Verify employer', exact: true }).click();
  await expect(trust).toHaveCount(0);
  await page.getByLabel('Filter employer verification').selectOption('verified');
  await expect(page.locator('.person-card').filter({ hasText: 'Siyakhula Community Trust' })).toContainText('Verified');
  await page.getByRole('button', { name: 'Job seekers', exact: true }).click();
  await page.locator('.person-card').filter({ hasText: 'Nomsa Dlamini' }).getByRole('button', { name: 'Verify', exact: true }).click();
  await expect(page.locator('.person-card').filter({ hasText: 'Nomsa Dlamini' })).toContainText('Verified');
  await page.getByRole('button', { name: 'Analytics', exact: true }).click();
  await expect(page.locator('.metric').filter({ hasText: 'Placement rate' }).locator('strong')).toHaveText('20%');
  await expect(page.getByRole('heading', { name: 'Qualification demand' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Where support can make a difference' })).toBeVisible();
});

test('register, sign in, and candidate readiness guard work', async ({ page }) => {
  await page.getByRole('button', { name: 'Get started', exact: true }).click();
  await page.getByRole('textbox', { name: 'Your name / company name', exact: true }).fill('Demo Candidate');
  await page.getByRole('textbox', { name: 'Email address', exact: true }).fill('demo.candidate@example.com');
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('DemoPassword123');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Hello, Demo.' })).toBeVisible();
  await page.getByRole('button', { name: 'Find opportunities', exact: true }).first().click();
  await page.getByRole('button', { name: 'View Diesel Mechanic', exact: true }).click();
  await page.getByRole('button', { name: 'Apply for this opportunity' }).click();
  await expect(page.getByRole('heading', { name: 'My profile', exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('before applying');
  await signout(page);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email address', exact: true }).fill('demo.candidate@example.com');
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('IncorrectPassword');
  await page.getByRole('button', { name: 'Sign in', exact: true }).last().click();
  await expect(page.getByRole('alert')).toContainText('incorrect');
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('DemoPassword123');
  await page.getByRole('button', { name: 'Sign in', exact: true }).last().click();
  await expect(page.getByRole('heading', { name: 'Hello, Demo.' })).toBeVisible();
});

test('mobile layouts fit the viewport and navigation works', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('heading', { name: /Connecting Carolina/ })).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.getByRole('button', { name: 'Find opportunities', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Find your opportunity.' })).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await demo(page,'Job seeker');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: '/tmp/cebt-mobile.png', fullPage: true });
});

test('desktop screenshot and all role pages render without JavaScript errors', async ({ page }) => {
  const errors: string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:'/tmp/cebt-home.png',fullPage:true});
  for(const role of ['Job seeker','Employer','CEBT admin'] as const){
    await demo(page,role);
    const nav=role==='Job seeker'?['My profile','My applications','Saved opportunities']:role==='Employer'?['My vacancies','Applicants','Company profile']:['Job seekers','Employers','Opportunities','Applications','Analytics'];
    for(const name of nav){await page.getByRole('navigation',{name:'Dashboard navigation'}).getByRole('button',{name,exact:true}).click();await expect(page.locator('.workspace-main h1')).toBeVisible();}
    if(role==='CEBT admin')await page.screenshot({path:'/tmp/cebt-admin.png',fullPage:true});
    await signout(page);
  }
  expect(errors).toEqual([]);
});
