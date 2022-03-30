import fs from 'fs-extra'
import { getManifest } from '../src/manifest.ts'
import { r, log } from './utils'

export async function writeManifest() {
  console.log('getManifest',getManifest)
  await fs.writeJSON(r('extension/manifest.json'), await getManifest(), { spaces: 2 })
  log('PRE', 'write manifest.json')
}

writeManifest()
