import {ref, watch, Ref} from "vue"

class ScrollListener {
    static entry: Ref<Element | undefined>//最新激活的元素
    marks: Element[] | undefined // 在集合中寻找要激活的元素
    otherHeight: number   //其他需要除去的高度
    other: Element[] | undefined // 在集合中寻找要激活的元素
    map: Map<string, Element> | undefined   //高度匹配映射
    source: Element | undefined  // 需要监听的元素
    processInstance: any   //监听处理函数
    scrollTop: number  // 监听元素的卷去的滚动高度
    timeouter: any  //防抖器

    constructor(source: Element | undefined, other?: Element[]) {
        ScrollListener.entry = ref<Element>()
        this.source = source
        this.marks = source?.querySelectorAll("h1,h2,h3,h4,h5,h6") as any
        this.processInstance = () => {
        }
        this.other = other
        this.scrollTop = 0
        this.otherHeight = 0
        this.map = new Map<string, Element>()
        this.watch()
    }

    equalAndSwap(source: Element | undefined, target: Element | undefined) {
        if (!Object.is(target, source)) {
            let oldE = document.querySelector(`p[data-primary_id="${source?.id}"]`)
            let oldOrigin = document.querySelector(`p[data-origin-id="${source?.id}"]`)
            let newE = document.querySelector(`p[data-primary_id="${target?.id}"]`)
            let newOrigin = document.querySelector(`p[data-origin-id="${target?.id}"]`)
            oldE = oldE || oldOrigin
            newE = newE || newOrigin
            oldE && (oldE.className = "")
            newE && (newE.className = "tocbot_active")
            oldE && oldE.scrollIntoView({
                block: "center",
                behavior: "smooth"
            })
        }
    }

    watch() {
        this.marks && Array.from(this.marks).forEach(value => {
            const {y, height} = value.getBoundingClientRect()
            this.map && this.map.set(y + "-" + height, value)
        })
        this.other && Array.from(this.other).forEach(value => {
            this.otherHeight += parseInt(value.getBoundingClientRect().height + "")
        })
        watch(ScrollListener.entry, (value, oldValue) => {
            let oldE = document.querySelector(`p[data-primary_id="${oldValue?.id}"]`)
            let oldOrigin = document.querySelector(`p[data-origin-id="${oldValue?.id}"]`)
            let newE = document.querySelector(`p[data-primary_id="${value?.id}"]`)
            let newOrigin = document.querySelector(`p[data-origin-id="${value?.id}"]`)
            oldE = oldE || oldOrigin
            newE = newE || newOrigin
            oldE && (oldE.className = "")
            newE && (newE.className = "tocbot_active")
            oldE && oldE.scrollIntoView({
                block: "center",
                behavior: "smooth"
            })
        })

    }

    process(this: any, e: any) {
        this.scrollTop = parseInt(e.target.scrollTop + "")
        this.antiShake(this.find.bind(this))
    }

    /**
     * 防抖函数
     * @param fun
     * @param time
     */
    antiShake(fun: Function, time = 10) {
        if (this.timeouter) {
            clearTimeout(this.timeouter) // 防止多次执行只执行最后一次任务
        }
        this.timeouter = setTimeout(() => {
            fun()
        }, time);
    }

    find() {
        const map = this.map
        if (map) {
            const keys = Array.from(map.keys())
            keys.forEach((value, index) => {
                const sp = value.split("-").map(value1 => parseInt(value1))
                if (sp[0] <= (this.scrollTop + sp[1] + this.otherHeight)) {
                    ScrollListener.entry.value = map.get(value)
                }
            })
        }
    }

    observer() {
        this.processInstance = this.process.bind(this)
        this.source?.addEventListener("scroll", this.processInstance)
    }

    removeListener() {
        this.source?.removeEventListener("scroll", this.processInstance)
        this.source = undefined
        this.marks = undefined
        ScrollListener.entry.value = undefined
        this.marks = undefined
        this.processInstance = () => {
        }
        this.other = undefined
        this.scrollTop = 0
        this.otherHeight = 0
        this.map = undefined
    }


}

export {
    ScrollListener
}
