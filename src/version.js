// Which translation the reader, cards and search use. Tyndale's API serves both.
import { createContext, useContext } from 'react'

export const VERSIONS = {
  NLT: {
    id: 'NLT',
    name: 'New Living Translation',
    copyright:
      'Scripture quotations are taken from the Holy Bible, New Living Translation, copyright © 1996, 2004, 2015 by Tyndale House Foundation. Used by permission of Tyndale House Publishers, Carol Stream, Illinois 60188. All rights reserved.',
  },
  KJV: {
    id: 'KJV',
    name: 'King James Version',
    copyright:
      'The King James Version (1611; text of the 1769 Oxford edition) is in the public domain in most of the world. In the United Kingdom its rights are vested in the Crown. Words in italics were supplied by the translators.',
  },
}

export const VersionContext = createContext('NLT')
export const useVersion = () => useContext(VersionContext)

export function savedVersion() {
  try {
    const v = localStorage.getItem('version')
    return VERSIONS[v] ? v : 'NLT'
  } catch {
    return 'NLT'
  }
}
