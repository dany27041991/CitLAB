from bs4 import BeautifulSoup
import requests
from refextract import extract_references_from_file, extract_references_from_url
import re
from selenium import webdriver
driver = webdriver.PhantomJS(executable_path="/Users/danilogiovannico/Desktop/PROGETTO DATABASE/CitLAB/ScrapingNCBI/phantomjs/bin/phantomjs")

base = "https://www.ncbi.nlm.nih.gov"
base_api = "https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pmc/?format=citation&id="
base_url = "https://www.ncbi.nlm.nih.gov/pmc/?term="

def clear_text(text):
    return text.replace("\"", "'").replace("<b>", "").replace("</b>", "").replace("<span>", "").replace("</span>", "").replace("<sup>", "").replace("</sup>", "").replace("<em>", "").replace("</em>", "").rstrip()

def extract_pdf_author_from_pdf(url):
    references = extract_references_from_file("/Users/danilogiovannico/Desktop/PROGETTO DATABASE/CitLAB/ScrapingNCBI/PDF/prova.pdf")

def extract_title(doc_page, obj, cit=True):
    title = doc_page.find("div", class_="title").find("a").text
    title = clear_text(title)
    obj["title"] = title
    return obj

def extract_pdf(doc_page, obj):
    a_links_pdf = doc_page.find("div", class_="links").find_all("a", href=True)
    for link_pdf in a_links_pdf:
        if "PDF" in link_pdf.text:
            obj["pdf"] = base + link_pdf['href']
            break
            #extract_pdf_author_from_pdf(obj["pdf"])
    return obj

def extract_references(doc_page,obj):
    array_references = []
    try:
        if doc_page.find("div", id="reference-list").find_all("div", class_="ref-cit-blk half_rhythm"):
            if doc_page.find("div", id="reference-list").find_all("div", class_="ref-cit-blk half_rhythm")[0].find_all("span",class_="element-citation"):
                references_div = doc_page.find_all("span", class_="element-citation")
                for ref in references_div:
                    ref_obj = {
                        "authors": None,
                        "title": None
                    }
                    ref_array = re.sub(' +', ' ',ref.text.replace("\n", " ").replace(".,",",").replace("\"", "'").replace("[PMC free article]", "").replace("[PubMed]", "").replace("[CrossRef]","").replace("[Google Scholar]", "")).split(".")
                    ref_array = [x.strip(' ') for x in ref_array]
                    ref_array = list(filter(None, ref_array))
                    index = None
                    for i,element in enumerate(ref_array,start=0):
                        if len(element) > 50:
                            break
                        if (re.search(" [A-Z]", element[-2:]) or len(element) == 1) and len(element) <= 100:
                            index = i
                    if index is not None:
                        if len('.'.join(ref_array[0:index+1])) < 150:
                            ref_obj["authors"] = '.'.join(ref_array[0:index+1])
                            ref_obj["title"] = '.'.join(ref_array[index+1:])
                        else:
                            ref_obj["title"] = '.'.join(ref_array[0:])
                    else:
                        if ref_array[0].count(',') < 2 and ref_array[0].count('.') < 2 and len(ref_array[0]) > 50:
                            ref_obj["title"] = '.'.join(ref_array[0:])
                        else:
                            ref_obj["authors"] = ref_array[0]
                            ref_obj["title"] = '.'.join(ref_array[1:])

                    if not ref_obj["title"]:
                        ref_obj["title"] = ref_obj["authors"]
                        ref_obj["authors"] = None
                    array_references.append(ref_obj)

        if doc_page.find("div", id="reference-list").find_all("div", class_="ref-cit-blk half_rhythm"):
            if doc_page.find("div", id="reference-list").find_all("div", class_="ref-cit-blk half_rhythm")[0].find_all("span",class_="mixed-citation"):
                references_div = doc_page.find_all("div", class_="ref-list-sec sec")[0].children
                for ref in references_div:
                    ref_obj = {
                        "authors": None,
                        "title": None
                    }
                    ref_array = re.sub(' +', ' ',ref.find("span", class_="mixed-citation").text.replace("\n", " ").replace(".,",",").replace("\"", "'").replace(" . ","").replace("[PMC free article]", "").replace("[PubMed]", "").replace("[CrossRef]","").replace("[Google Scholar]", "")).split(".")
                    ref_array = [x.strip(' ') for x in ref_array]
                    ref_array = list(filter(None, ref_array))
                    index = None
                    for i, element in enumerate(ref_array, start=0):
                        if len(element) > 50:
                            break
                        if (re.search(" [A-Z]", element[-2:]) or len(element) == 1) and len(element) <= 100:
                            index = i
                    if index is not None:
                        if len('.'.join(ref_array[0:index+1])) < 150:
                            ref_obj["authors"] = '.'.join(ref_array[0:index+1])
                            ref_obj["title"] = '.'.join(ref_array[index+1:])
                        else:
                            ref_obj["title"] = '.'.join(ref_array[0:])
                    else:
                        if ref_array[0].count(',') < 2 and ref_array[0].count('.') < 2 and len(ref_array[0]) > 50:
                            ref_obj["title"] = '.'.join(ref_array[0:])
                        else:
                            ref_obj["authors"] = ref_array[0]
                            ref_obj["title"] = '.'.join(ref_array[1:])

                    if not ref_obj["title"]:
                        ref_obj["title"] = ref_obj["authors"]
                        ref_obj["authors"] = None
                    array_references.append(ref_obj)

        if doc_page.find("div", id="reference-list").find_all("li"):
            references_div = doc_page.find_all("span", class_="element-citation")
            for ref in references_div:
                ref_obj = {
                    "authors": None,
                    "title": None
                }
                ref_array = re.sub(' +', ' ',ref.text.replace("\n", " ").replace(".,",",").replace("\"", "'").replace(" . ", "").replace("[PMC free article]","").replace("[PubMed]","").replace("[CrossRef]", "").replace("[Google Scholar]", "")).split(".")
                index = None
                for i, element in enumerate(ref_array, start=0):
                    if len(element) > 50:
                        break
                    if (re.search(" [A-Z]", element[-2:]) or len(element) == 1) and len(element) <= 100:
                        index = i
                if index is not None:
                    if len('.'.join(ref_array[0:index + 1])) < 150:
                        ref_obj["authors"] = '.'.join(ref_array[0:index + 1])
                        ref_obj["title"] = '.'.join(ref_array[index + 1:])
                    else:
                        ref_obj["title"] = '.'.join(ref_array[0:])
                else:
                    if ref_array[0].count(',') < 2 and ref_array[0].count('.') < 2 and len(ref_array[0]) > 50:
                        ref_obj["title"] = '.'.join(ref_array[0:])
                    else:
                        ref_obj["authors"] = ref_array[0]
                        ref_obj["title"] = '.'.join(ref_array[1:])

                if not ref_obj["title"]:
                    ref_obj["title"] = ref_obj["authors"]
                    ref_obj["authors"] = None

                array_references.append(ref_obj)
    except:
        #print("Errore {}".format(obj['title']))
        print("\n")
    return array_references


def extract_abstract(obj):
    html_content_doc = requests.get(obj["url"]).text
    soup_doc = BeautifulSoup(html_content_doc, "lxml")
    try:
        pdoc = soup_doc.find_all("p", class_="p p-first-last")
        if len(pdoc) == 0:
            driver.get(obj["url"])
            p_element = driver.find_element_by_class_name('p-first-last')
            obj["abstract"] = clear_text(p_element.text)
        else:
            for j, p in enumerate(pdoc, start=0):
                if j == 0:
                    obj["abstract"] = clear_text(p.text)
                    break
    except:
        #print("Errore {}".format(obj['title']))
        print("\n")
    obj["references"] = extract_references(soup_doc,obj)
    return obj

def extract_authors(doc_page, obj):
    authorsdiv = doc_page.find_all("div", class_="supp")
    for i, line in enumerate(authorsdiv, start=0):
        for k, core in enumerate(line.children, start=0):
            if k == 0:
                obj["authors"] = core.text
            if k == 1:
                spans = core.find_all('span')
                obj["publishing_company"] = core.get_text().split(".")[0]
                if len(spans) == 2:
                    for count, span in enumerate(spans, start=0):
                        if count == 0:
                            d = re.findall('(\d{4})', span.text)
                            obj["year"] = d[0]
                        if count == 1:
                            if "Published online" in span.text:
                                obj["publication_date"] = span.text.rstrip()
                            if "doi" in span.text:
                                obj["doi"] = span.text.split(":")[1].rstrip()
                if len(spans) == 3:
                    for count, span in enumerate(spans, start=0):
                        if count == 0:
                            d = re.findall('(\d{4})', span.text)
                            obj["year"] = d[0]
                        if count == 1:
                            if "Published online" in span.text:
                                obj["publication_date"] = span.text.rstrip()
                            if "doi" in span.text:
                                obj["doi"] = span.text.split(":")[1].rstrip()
                        if count == 2:
                            if "Published online" in span.text:
                                obj["publication_date"] = span.text.rstrip()
                            if "doi" in span.text:
                                obj["doi"] = span.text.split(":")[1].rstrip()
                if len(spans) == 4:
                    for count, span in enumerate(spans, start=0):
                        if count == 0:
                            d = re.findall('(\d{4})', span.text)
                            obj["year"] = d[0]
                        if count == 1:
                            if "Published online" in span.text:
                                obj["publication_date"] = span.text.rstrip()
                            if "doi" in span.text:
                                obj["doi"] = span.text.split(":")[1].rstrip()
                        if count == 2:
                            if "Published online" in span.text:
                                obj["publication_date"] = span.text.rstrip()
                            if "doi" in span.text:
                                obj["doi"] = span.text.split(":")[1].rstrip()
                        if count == 3:
                            if "Published online" in span.text:
                                obj["publication_date"] = span.text.rstrip()
                            if "doi" in span.text:
                                obj["doi"] = span.text.split(":")[1].rstrip()
        obj = extract_abstract(obj)
    return obj

def mentioned_in(obj):
    array_citation = []
    count = 0
    for el in obj["references"]:
        if len(el["title"].lstrip().split(".")[0]) > 16:
            #print(el["title"].lstrip().split(".")[0])
            html_content = requests.get(base_url+el["title"].lstrip().split(".")[0]).text
            soup = BeautifulSoup(html_content, "lxml")

            separator = ', '
            link_array = []
            divs = soup.find_all("div", class_="rslt")
            for row in divs:
                obj_cit = {
                    "title": None,
                    "abstract": None,
                    "url": base + row.find("a").get("href"),
                    "authors": None,
                    "year": None,
                    "publishing_company": None,
                    "publication_date": None,
                    "doi": None,
                    "pdf": None,
                    "mentioned_by": [],
                    "references": []
                }
                obj_cit = extract_title(row, obj_cit)
                obj_cit = extract_pdf(row, obj_cit)
                obj_cit = extract_authors(row, obj_cit)
                array_citation.append(obj_cit)
                if count > 5:
                    break
                count = count + 1
            if count > 5:
                break
    obj["mentioned_by"] = array_citation
    return obj

html_content = requests.get(base_url+"clinical+data").text
soup = BeautifulSoup(html_content, "lxml")

separator = ', '
link_array = []
divs = soup.find_all("div", class_="rslt")
for row in divs:
    obj = {
            "title": None,
            "abstract": None,
            "url": base + row.find("a").get("href"),
            "authors": None,
            "year": None,
            "publishing_company": None,
            "publication_date": None,
            "doi": None,
            "pdf": None,
            "mentioned_by": [],
            "references": []
    }

    obj = extract_title(row, obj)
    obj = extract_pdf(row, obj)
    obj = extract_authors(row, obj)
    obj = mentioned_in(obj)
    link_array.append(obj)
    print(obj)
