interface TocbotType {
    tobocName: string,
    tobocId: string,
    originId: string,
    order: number,
    level: number,
    preItem?: TocbotType,
    nextItem?: TocbotType,
    childers?: TocbotType[],
}

interface PushIndexType {
    index: number,
    unquie: number,
}

class TocbotTree {
    fristItem: TocbotType | undefined;
    lastItem: TocbotType | undefined;
    pushIndex: PushIndexType | undefined

    constructor() {
    }

    init(fristItem?: TocbotType, lastItem?: TocbotType, pushIndex?: PushIndexType) {
        this.fristItem = fristItem;
        this.lastItem = lastItem;
        this.pushIndex = pushIndex;
    }

    initPushIndex(pushIndex: PushIndexType) {
        this.pushIndex = pushIndex
    }

    doAddItem(item: TocbotType) {
        const lastOld = this.lastItem
        this.toFlashBack(item.level, lastOld)
        if (Array.isArray(this.lastItem?.childers)) {
            this.lastItem?.childers.push(item)
        } else {
            // @ts-ignore
            if (this.lastItem?.childers) {
                this.lastItem.childers = [{...item}]
            }
        }
        item.preItem = this.lastItem
        item.order = this.lastItem ? this.lastItem.order + 1 : 0
        item.nextItem = undefined
        this.lastItem = item

    }

    toFlashBack(level: number, tobotItems?: TocbotType) {
        let tobotLevel = tobotItems?.level
        if (tobotLevel && tobotLevel >= level) {
            this.lastItem = tobotItems?.preItem
        }
        if (tobotItems?.preItem) {
            this.toFlashBack(level, tobotItems?.preItem)
        }
    }
}

class Tocbot extends TocbotTree {
    tocbot: Array<Tocbot>

    constructor(tocbotTree: Array<Tocbot>) {
        super()
        this.tocbot = tocbotTree;
    }

    addItem(item: TocbotType) {
        this.pushIndex && (this.pushIndex.unquie += 1)
        if (this.fristItem && this.fristItem.level >= item.level) {
            this.pushIndex && (this.pushIndex.index += 1)
            const entriy = {
                tobocName: item.tobocName,
                tobocId: `toc${this.pushIndex && this.pushIndex.index}+${item.level}+${item.tobocName}+${this.pushIndex && this.pushIndex.unquie}`,
                level: item.level,
                order: item.order,
                originId: item.originId,
                childers: [],
            }
            const root = new Tocbot(this.tocbot);
            root.init(entriy, entriy, this.pushIndex)
            this.pushIndex && (this.tocbot[this.pushIndex.index] = root)
        } else {
            this.doAddItem(item)
        }
    }

    /**
     *
     * @param leval 标题级别
     * @param raw  标题名
     * @param originId 实际标题id
     * @param pushIndex 标题层级
     */
    pushData(leval: number, raw: string, originId: string, pushIndex: PushIndexType) {
        const id = pushIndex.index
        pushIndex.unquie += 1
        const parent = id && this.tocbot[id];

        const entriy = {
            tobocName: raw,
            tobocId: `toc${id}+${leval}+${raw}+${pushIndex.unquie}`,
            originId: originId,
            order: 0,
            level: leval,
            childers: [],
        }
        if (parent) {
            parent.addItem(entriy)
        } else {
            const root = new Tocbot(this.tocbot);
            root.init(entriy, entriy, pushIndex)
            id && (this.tocbot[id] = root);
        }
    }
}

class TocbotTemplate {
    tocbot: Tocbot
    pushIndex: PushIndexType
    flagLevel: number[]

    constructor() {
        this.tocbot = new Tocbot([])
        this.flagLevel = []
        this.pushIndex = {
            index: 1,
            unquie: 0
        }
        this.tocbot.initPushIndex(this.pushIndex)
    }

    /**
     *
     * @param level 标题级别
     * @param raw  标题名
     * @param originId 实际标题id
     */
    analysis(level: number, raw: string, originId: string) {
        if ((Object.is(Math.min(...this.flagLevel, level), level) && this.flagLevel.length - 1)) {
            this.flagLevel = []
            this.pushIndex.index += 1;
        }
        this.flagLevel.push(level)
        this.tocbot.pushData(level, raw, originId, this.pushIndex)
    }

    getTocbot(): Tocbot[] {
        return this.tocbot.tocbot
    }
}


export {
    TocbotTemplate
}
export type{
    TocbotType,
    PushIndexType,
    Tocbot
}