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
  type AllServerAPIResponse = {
    AllServer_Gunas: number;
  };
  const fetchTemplates = {
    GET: {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
      },
      redirect: "follow",
    },
  };
  class ElementControler {
    element: elements;
    audio: any;
    state: any;
    constructor(args: any) {
      this.element = args;
      this.state = { gunas: 0, allserver: 0 };
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
    private async getData(url: string, options: any): Promise<any> {
      const response = await fetch(url, options);
      return await response.json();
    }
    /**
     * 初始化函数
     */
    public async init() {
      // 获取全服功德数据
      this.getData("/api/gunas", fetchTemplates.GET)
        .then((data: AllServerAPIResponse) => {
          // 如果没有这个参数则立即抛出
          if (!data["AllServer_Gunas"]) {
            throw data;
          }
          this.setState("allserver", data["AllServer_Gunas"]);
          this.element.AllServer.text(
            `${this.getState("allserver")} + ${this.getState("gunas")}`
          );
        })
        .catch((e) => {
          this.element.AllServer.text("数据获取失败");
          debugger;
          console.error(e);
        });
      // 绑定事件
      this.element.muyu.on("click", () => {
        this.element.muyu.addClass("Zoom");
        // 更新数据
        this.element.AllServer.text(
          `${this.getState("allserver")} + ${this.getState("gunas")}`
        );
        this.setState("gunas", this.getState("gunas") + 1);
        console.log(this.state);
        this.audio.play();
      });
      // 设置监听器
      this.audio.addEventListener("ended", () => {
        $(this.element.muyu).removeClass("Zoom");
      });
    }
  }
  // 变量名就稍微随性一点
  const muyu_dom = $("#muyu");
  const allserver_dom = $("#AllServer-Guna");
  const el = new ElementControler({
    muyu: muyu_dom,
    AllServer: allserver_dom,
    url: "./static/Audio/muyu.mp3",
  });
  el.init();
});
