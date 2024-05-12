const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
      
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
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'delete' }).click()

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

      // Log out as testUser
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
      await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
      await expect(page.getByTestId('deleteButton')).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page }) => {
      // Create blogs
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('East of Eden')
      await page.getByTestId('author').fill('John Steinbeck')
      await page.getByTestId('url').fill('https//ft.com')
      await page.getByRole('button', { name: 'save' }).click()

      await expect(page.getByTestId('blog')).toHaveCount(1)
      await expect(page.getByTestId('blog').filter({ hasText: 'East of Eden' })).toHaveCount(1)

      await page.getByTestId('title').fill('Moby Dick')
      await page.getByTestId('author').fill('Herman Melville')
      await page.getByTestId('url').fill('https//goodreads.com')
      await page.getByRole('button', { name: 'save' }).click()

      await expect(page.getByTestId('blog')).toHaveCount(2)
      await expect(page.getByTestId('blog').filter({ hasText: 'Moby Dick' })).toHaveCount(1)

      await page.getByTestId('title').fill('Emma')
      await page.getByTestId('author').fill('Jane Austen')
      await page.getByTestId('url').fill('https//poetryfoundation.com')
      await page.getByRole('button', { name: 'save' }).click()

      await expect(page.getByTestId('blog')).toHaveCount(3)
      await expect(page.getByTestId('blog').filter({ hasText: 'Emma' })).toHaveCount(1)

      // Like Emma two times
      await page.getByTestId('blog').filter({ hasText: 'Emma' }).getByTestId('viewButton').click()
      await expect(page.getByTestId('blog').filter({ hasText: 'Emma' }).getByText('likes: 0')).toBeVisible()
      await page.getByTestId('blog').filter({ hasText: 'Emma' }).getByRole('button', { name: 'like' }).click()
      await expect(page.getByTestId('blog').filter({ hasText: 'Emma' }).getByText('likes: 1')).toBeVisible()
      await page.getByTestId('blog').filter({ hasText: 'Emma' }).getByRole('button', { name: 'like' }).click()
      await expect(page.getByTestId('blog').filter({ hasText: 'Emma' }).getByText('likes: 2')).toBeVisible()
      
      // Like Moby Dick once
      await page.getByTestId('blog').filter({ hasText: 'Moby Dick' }).getByTestId('viewButton').click()
      await expect(page.getByTestId('blog').filter({ hasText: 'Moby Dick' }).getByText('likes: 0')).toBeVisible()
      await page.getByTestId('blog').filter({ hasText: 'Moby Dick' }).getByRole('button', { name: 'like' }).click()
      await expect(page.getByTestId('blog').filter({ hasText: 'Moby Dick' }).getByText('likes: 1')).toBeVisible()
      
      // Expect order of blogs to be Emma (2 likes), Moby Dick (1 like), East of Eden (0 likes)
      await expect(page.getByTestId('blog').first()).toContainText('Emma')
      await expect(page.getByTestId('blog').nth(1)).toContainText('Moby Dick')
      await expect(page.getByTestId('blog').last()).toContainText('East of Eden')

    })

  })

})