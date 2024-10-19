import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function printFilesAndFolders(directory: string) {
  try {
    console.log(`Listing files and folders in: ${directory}`)

    // Run the tree command
    const { stdout, stderr } = await execAsync(
      `tree ${directory} --noreport -I node_modules`
    )

    if (stderr) {
      console.error(`Error: ${stderr}`)
      return
    }

    // Print the output of the tree command
    console.log(stdout)
  } catch (error) {
    console.error(`Failed to list files: ${error}`)
  }
}
