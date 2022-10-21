$(() => {
  /**
   * 元素 DOM 操作缓存器
   * @param muyu 木鱼 DOM 节点
   * @param AllServer 全服
   * @param AllClick 总计
   * @param TodayClick 今日敲击
   */
  type elements = {
    muyu: any;
    AllServer: any;
    AllClick: any;
    TodayClick: any;
  };
  const fetchTemplates = {
    GET: {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      redirect: "follow",
    },
  };
  class ElementControler {
    element: elements;
    audio: any;
    state: any;
    constructor(args: any) {
      this.element = args;
      this.state = { gunas: 0 };
      this.audio = new Audio(args.url);
    }
    /**
     * @param index 索引
     * @param value 值
     * 用于设置 State
     */
    private setState(index: string | number, value: any): void {
      this.state[index] = value;
    }
    /**
     * @param index 索引
     * @returns {any} 返回 State 信息
     */
    private getState(index: string | number): any {
      return this.state[index];
    }
    /**
     *
     * @param url 链接
     * @param options Fetch 配置
     * @returns {any} 返回已解构 JSON 的对象
     */
    private async fetchAPI(url: string, options: any): Promise<any> {
      const response = await fetch(url, options);
      return await response.json();
    }
    /**
     * 初始化函数
     */
    public async init(): Promise<any> {
      this.element.muyu.on("click", () => {
        this.element.muyu.addClass("Zoom");
        this.setState("gunas", this.getState("gunas") + 1);
        console.log(this.state);
        this.audio.play();
      });
      this.audio.addEventListener("ended", () => {
        $(this.element.muyu).removeClass("Zoom");
      });
    }
  }
  const muyu = $("#muyu");
  const el = new ElementControler({ muyu, url: "./static/Audio/muyu.mp3" });
  el.init();
});
