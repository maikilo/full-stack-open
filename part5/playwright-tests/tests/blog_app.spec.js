const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    const testUser = {
        name: 'Test User',
        username: 'testUser',
        password: 'password',
      }
      
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testUser',
        password: 'password'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    await page.getByRole('button', { name: 'login' }).click()
    /* await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible() */
    await expect(page.getByTestId('loginForm')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByTestId('login-username').fill('testUser')
      await page.getByTestId('login-password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Logged in user testUser successfully')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByTestId('login-username').fill('testUser')
      await page.getByTestId('login-password').fill('wrong-password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })

})