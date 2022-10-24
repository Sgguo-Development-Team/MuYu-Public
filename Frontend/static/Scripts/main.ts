$(() => {
  /**
   * 元素 DOM 操作缓存器
   * @param muyu 木鱼 DOM 节点
   * @param AllServer 全服
   * @param AllClick 总计
   * @param TodayClick 今日敲击
   */
  type elements = {
    muyu: JQuery;
    AllServer: JQuery;
    AllClick: JQuery;
    TodayClick: JQuery;
    url: string;
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
  type StorageType = {
    expires: number;
    value: string;
    startTime: number;
  };
  interface IStorage {
    /**
     * 设置 Item
     * @param params
     */
    setItem: any;
    /**
     * 获取值
     * @param name 索引
     * @returns {any} 值
     */
    getItem: any;
    /**
     * 擦除值
     * @param name 索引
     */
    removeItem: any;
    /**
     * 格式化
     */
    clear: any;
  }
  /**
   * 增强版本地存储
   */
  class Storage implements IStorage {
    setItem(index: string, params: StorageType) {
      console.log(params);
      localStorage.setItem(index, JSON.stringify(params));
    }
    getItem(name: string) {
      let item: any = localStorage.getItem(name) || "";
      try {
        item = JSON.parse(item);
      } catch (error) {
        item = item;
      }
      if (item.startTime) {
        const date = new Date().getTime();
        if (date - item.startTime > item.expires) {
          localStorage.removeItem(name);
          return false;
        } else {
          return item.value;
        }
      } else {
        return item;
      }
    }
    removeItem(name: string) {
      localStorage.removeItem(name);
    }
    clear() {
      localStorage.clear();
    }
  }
  const DeeperStorage: IStorage = new Storage();
  type addGunasObj = {
    AllGunas: number;
    TodayGunas: number;
  };
  /**
   * 功德操作
   */
  class Gunas {
    getAllGunas() {
      return DeeperStorage.getItem("AllGunas");
    }
    getTodayGunas() {
      return DeeperStorage.getItem("TodayGunas");
    }
    addGunas(num: number): addGunasObj {
      localStorage.setItem(
        "AllGunas",
        JSON.stringify({
          value: this.getAllGunas().value + num,
        })
      );
      DeeperStorage.setItem("TodayGunas", {
        value: this.getTodayGunas() + num,
        expriess: 1000 * 60 * 60 * 24 * 7,
        startTime: new Date().getTime(),
      });
      return {
        AllGunas: this.getAllGunas().value,
        TodayGunas: this.getTodayGunas(),
      };
    }
  }
  // 浅浅 new 一个
  const GunasControler = new Gunas();
  // 定义 ElementControler 类
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
     * @param url 链接
     * @param options Fetch 配置
     * @returns {any} 返回已解构 JSON 的对象
     */
    private async getData(url: string, options: any) {
      const response = await fetch(url, options);
      return await response.json();
    }
    /**
     * 初始化存储系统函数
     */
    private async initStorage(): Promise<void> {
      // 如果先前没有存储过，现在创建
      if (
        !DeeperStorage.getItem("AllGunas") &&
        !DeeperStorage.getItem("TodayGunas")
      ) {
        localStorage.setItem("AllGunas", JSON.stringify({ value: 0 }));
        DeeperStorage.setItem("TodayGunas", {
          value: 0,
          expriess: 60 * 60 * 24,
          startTime: new Date().getTime(),
        });
      }
      return;
    }
    /**
     * 初始化函数
     */
    public async init(): Promise<void> {
      this.initStorage();
      // 获取全服功德数据
      try {
        const res: AllServerAPIResponse = await this.getData(
          "/api/gunas",
          fetchTemplates.GET
        );
        if (res.AllServer_Gunas) throw res; //直接抛了
        this.setState("allserver", res.AllServer_Gunas);
        this.element.AllServer.text(
          `${this.getState("allserver")} + ${this.getState("gunas")}`
        );
      } catch (error) {
        this.element.AllServer.text("数据获取失败");
        console.error(error);
      }
      // 预备更新
      this.element.AllClick.text(GunasControler.getAllGunas().value);
      this.element.TodayClick.text(GunasControler.getTodayGunas());
      // 绑定事件
      this.element.muyu.on("click", () => {
        this.element.muyu.addClass("Zoom");
        // 更新数据
        const contentData = GunasControler.addGunas(1);
        // 设置两项数据
        this.element.AllClick.text(contentData.AllGunas);
        this.element.TodayClick.text(contentData.TodayGunas);
        // 设置服务端
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
  const todayclick_dom = $("#TodayClick-Guna");
  const allclick_dom = $("#AllClick-Guna");
  const options: elements = {
    muyu: muyu_dom,
    TodayClick: todayclick_dom,
    AllServer: allserver_dom,
    url: "./static/Audio/muyu.mp3",
    AllClick: allclick_dom,
  };
  const el = new ElementControler(options);
  el.init();
});
