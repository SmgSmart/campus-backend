# Campus Map Backend

This is the backend API for the Campus Map & AR Navigation system.

## Deployment Instructions (to Render/GitHub)

1. **Initialize Git in this folder**:

   ```bash
   cd backend
   git init
   git add .
   git commit -m "Prepare for deployment"
   ```

2. **Push to GitHub**:
   - Create a new repository on GitHub called `campus-backend`.
   - Follow the instructions on GitHub to push your local code.
   - _Note: Don't worry about the 6GB, Git will ignore the heavy folders automatically thanks to the `.gitignore` I created!_

3. **Deploy on Render**:
   - Log in to [Render.com](https://render.com).
   - Click **New +** > **Blueprint**.
   - Connect your GitHub repo.
   - Render will see the `render.yaml` file and set everything up for you!

## Environment Variables Needed

- `DATABASE_URL`: Your PostgreSQL connection string (e.g., from Neon.tech).
- `JWT_SECRET`: A secret key for authentication.
- `PORT`: Default is 5000.
