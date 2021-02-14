/**
 * @version 1.0.1
 * @author Blaze
 * @since 23/1/2021
 */


/**
 * Class for the API wrapper of https://knackt.nu/
 * 
 * @info If there is a json parse error raised, token is invalid
 */
export class Knackt {
  private headers: { cookie: string };

  public encoder = new TextEncoder().encode;
  public base: string = "https://api.knackt.nu/";

  /**
   * @param token user token used to login to site
   * @param base optional, to change the base url, default "https://api.knackt.nu/"
   * 
   * @example `new Knackt(token, ...)`
   */
  constructor(token: string, base?: string) {
    if (
      !token.match(
        "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
      )
    ) {
      throw TypeError("invalid token");
    }

    this.headers = { cookie: `token=${token}` };

    if (typeof base !== "undefined") {
      this.base = base;
    }
  }

  /**
   * @since 1.0.0
   * 
   * @returns all the available categories
   * 
   * @example `new Knackt(...).categories()`
   */
  categories = async (): Promise<Array<{ name: string; created: number }>> => {
    
    const url: string = this.base + "categories";
    const res: Response = await fetch(url, { headers: this.headers });

    return res.json();
  };

  /**
   * @since 1.0.0
   * 
   * @param timestamp UNIX timestamp of a category,
   * can be able to get from `@function ~categories()`
   * 
   * @returns all combolists in the category
   * 
   * @example `new Knackt(...).category_created(1609323728635)`
   */
  category_created = async (timestamp: string | number): Promise<
    Array<{
      category: number;
      name: string;
      hash: string;
      uploaded: number;
      downloaded: boolean;
    }> | { success: false; error: string }
  > => {
    const url: string = this.base + "category/" + timestamp;
    const res: Response = await fetch(url, { headers: this.headers });

    return res.json();
  };

  /**
   * @since 1.0.0
   * 
   * Needs the `--allow-write` flag to be able to write to the file
   * 
   * @param path path to file to write to
   * @param hash md5 hash of the combo, 
   * can be found from `@function ~category_created(...)`
   * @param name name of the file to download
   * @param append append to the @param file, optional 
   */
  download = async (
    path: string,
    hash: string,
    name: string,
    append?: boolean,
  ): Promise<void> => {
    const url: string = `${this.base}download/${hash}/${name}`;
    const res: Response = await fetch(url, { headers: this.headers });
    const header = res.headers.get("content-type");
    console.log(header);

    if (header && header.includes("application/json")) {
      const json = await res.json();

      if (!json.success) {
        throw json.error;
      }
    }

    const text = await res.text();
    Deno.writeFile(path, this.encoder(text), { append });
  };
}
