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
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Other User',
        username: 'otherUser',
        password: 'drowssap'
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

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByTestId('login-username').fill('testUser')
      await page.getByTestId('login-password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()
    })
  
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await expect(page.getByTestId('blogForm')).toBeVisible()

      await page.getByTestId('title').fill('East of Eden')
      await page.getByTestId('author').fill('John Steinbeck')
      await page.getByTestId('url').fill('https//goodreads.com')
      await page.getByRole('button', { name: 'save' }).click()

      // Check that blog was added to list
      await expect(page.getByText('East of Eden')).toBeVisible()
      await expect(page.getByText('John Steinbeck')).toBeVisible()

      // Check that blog details can be viewed
      await page.getByTestId('viewButton').click()
      await expect(page.getByText('url: https//goodreads.com')).toBeVisible()
      await expect(page.getByText('likes: 0')).toBeVisible()
      await expect(page.getByText('user: Test User')).toBeVisible()
    })

    test('a blog can be edited', async ({ page }) => {
      // The only "edit" we've implemented in the frontend is liking the blog

      // Create blog
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('East of Eden')
      await page.getByTestId('author').fill('John Steinbeck')
      await page.getByTestId('url').fill('https//goodreads.com')
      await page.getByRole('button', { name: 'save' }).click()

      // Like the blog twice and check that the number of likes is updated correspondingly
      await page.getByTestId('viewButton').click()
      await expect(page.getByText('likes: 0')).toBeVisible()
      page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes: 1')).toBeVisible()
      page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes: 2')).toBeVisible()
    })

    test('a blog can be deleted by the user who created it', async ({ page }) => {
      // Create blog as testUser
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('East of Eden')
      await page.getByTestId('author').fill('John Steinbeck')
      await page.getByTestId('url').fill('https//goodreads.com')
      await page.getByRole('button', { name: 'save' }).click()

      // Delete the blog as testUser
      await page.getByTestId('viewButton').click()
      await page.getByTestId('deleteButton').click()

      page.on('dialog', async dialog => {
        await expect(dialog.message()).toHaveText('Sure you want to delete East of Eden?')
        await dialog.accept()
      })
      await expect(page.getByTestId('blog')).not.toHaveText('East of Eden')
    })

    test('a user cannot see the delete button for blogs created by another user', async ({ page }) => {
      // Create blog as testUser
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('Moby Dick')
      await page.getByTestId('author').fill('Herman Melville')
      await page.getByTestId('url').fill('https//goodreads.com')
      await page.getByRole('button', { name: 'save' }).click()

      // Log out as otherUser
      await page.getByRole('button', { name: 'logout' }).click()

      // Login as otherUser
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByTestId('login-username').fill('otherUser')
      await page.getByTestId('login-password').fill('drowssap')
      await page.getByRole('button', { name: 'login' }).click()

      // View the blog as otherUser
      await page.getByTestId('viewButton').click()
      await expect(page.getByText('Moby Dick')).toBeVisible()
      await expect(page.getByText('Herman Melville')).toBeVisible()
      await expect(page.getByText('likes: 0')).toBeVisible()
      await expect(page.getByTestId('likeButton')).toBeVisible()
      await expect(page.getByTestId('deleteButton')).not.toBeVisible()
    })

  })

})