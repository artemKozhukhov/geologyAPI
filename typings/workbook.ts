export interface IWorkbookWell {
  name: string,
  head: {
    x: number,
    y: number,
    z: number,
  }
}

export interface IWorkbookLithology {
  depthFrom: number,
  depthTo: number,
  rockName: string,
  wellName: string,
}

export interface IWorkbookInclinometry{
  azimut: number,
  zenit: number,
  depth: number,
  wellName: string,
}
